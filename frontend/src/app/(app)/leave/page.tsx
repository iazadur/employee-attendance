"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useMeQuery } from "@/store/authApi";
import {
  useCreateLeaveMutation,
  useListAllLeavesQuery,
  useMyLeaveQuery,
  useReviewLeaveMutation,
} from "@/store/leaveApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const leaveTypes = [
  "ANNUAL",
  "SICK",
  "CASUAL",
  "MATERNITY",
  "PATERNITY",
  "UNPAID",
] as const;

type LeaveType = (typeof leaveTypes)[number];

function isLeaveType(v: string): v is LeaveType {
  return (leaveTypes as readonly string[]).includes(v);
}

export default function LeavePage() {
  const me = useMeQuery();
  const role = me.data?.user.role;
  const canReview = role === "ADMIN" || role === "MANAGER";
  const myLeave = useMyLeaveQuery();
  const allLeave = useListAllLeavesQuery(undefined, {
    skip: !canReview,
  });
  const [createLeave, createState] = useCreateLeaveMutation();
  const [reviewLeave, reviewState] = useReviewLeaveMutation();

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<LeaveType>("ANNUAL");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [reason, setReason] = useState("");

  const rows = useMemo(() => {
    if (canReview) return allLeave.data ?? [];
    return myLeave.data ?? [];
  }, [canReview, allLeave.data, myLeave.data]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leave</h1>
          <p className="text-sm text-muted-foreground">
            {canReview
              ? "Review leave requests"
              : "Request and track leave"}
          </p>
        </div>

        {!canReview ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />}>Request leave</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New leave request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Leave type</Label>
                  <Select
                    value={type}
                    onValueChange={(v) =>
                      setType(v && isLeaveType(v) ? v : "ANNUAL")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Start</Label>
                    <Input value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>End</Label>
                    <Input value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason..." />
                </div>
                <Button
                  className="w-full"
                  disabled={createState.isLoading}
                  onClick={async () => {
                    try {
                      await createLeave({
                        leaveType: type,
                        startDate,
                        endDate,
                        reason,
                      }).unwrap();
                      toast.success("Leave request submitted");
                      setOpen(false);
                      myLeave.refetch();
                    } catch {
                      toast.error("Failed to submit leave request");
                    }
                  }}
                >
                  {createState.isLoading ? "Submitting..." : "Submit request"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Status</TableHead>
              {canReview ? (
                <TableHead className="text-right">Action</TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.leaveType}</TableCell>
                  <TableCell>{new Date(r.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(r.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{r.totalDays}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === "APPROVED" ? "default" : r.status === "REJECTED" ? "destructive" : "secondary"}>
                      {r.status}
                    </Badge>
                  </TableCell>
                  {canReview ? (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          disabled={reviewState.isLoading}
                          onClick={async () => {
                            try {
                              await reviewLeave({ id: r.id, status: "APPROVED" }).unwrap();
                              toast.success("Approved");
                              allLeave.refetch();
                            } catch {
                              toast.error("Failed to approve");
                            }
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={reviewState.isLoading}
                          onClick={async () => {
                            try {
                              await reviewLeave({ id: r.id, status: "REJECTED" }).unwrap();
                              toast.success("Rejected");
                              allLeave.refetch();
                            } catch {
                              toast.error("Failed to reject");
                            }
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={canReview ? 6 : 5} className="py-10 text-center text-sm">
                  {myLeave.isLoading || allLeave.isLoading ? "Loading..." : "No leave requests"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

