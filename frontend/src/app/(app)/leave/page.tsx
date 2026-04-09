"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AttendanceStatusPie } from "@/components/charts/AttendanceStatusPie";
import { ChartSectionCard } from "@/components/sections/ChartSectionCard";
import { PageSectionHeader } from "@/components/sections/PageSectionHeader";

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

const leaveRequestSchema = z
  .object({
    leaveType: z.enum(leaveTypes, { message: "Select leave type" }),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    reason: z.string().trim().min(3, "Reason must be at least 3 characters"),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be same or after start date",
    path: ["endDate"],
  });

type LeaveRequestFormValues = z.infer<typeof leaveRequestSchema>;

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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const leaveForm = useForm<LeaveRequestFormValues>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      leaveType: "ANNUAL",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      reason: "",
    },
    mode: "onChange",
  });

  const rows = useMemo(() => {
    if (canReview) return allLeave.data ?? [];
    return myLeave.data ?? [];
  }, [canReview, allLeave.data, myLeave.data]);
  const leaveSummary = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = (acc[row.status] ?? 0) + 1;
    return acc;
  }, {});

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);

  function getApiErrorMessage(error: unknown): string {
    if (typeof error === "object" && error !== null && "data" in error) {
      const data = (error as { data?: { message?: unknown } }).data;
      if (Array.isArray(data?.message)) {
        return data.message.filter((item) => typeof item === "string").join(", ");
      }
      if (typeof data?.message === "string") {
        return data.message;
      }
    }
    return "Failed to submit leave request";
  }

  async function handleLeaveSubmit(values: LeaveRequestFormValues) {
    setSubmitError(null);
    try {
      await createLeave({
        leaveType: values.leaveType,
        startDate: values.startDate,
        endDate: values.endDate,
        reason: values.reason.trim(),
      }).unwrap();
      toast.success("Leave request submitted");
      setOpen(false);
      leaveForm.reset({
        leaveType: "ANNUAL",
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
        reason: "",
      });
      myLeave.refetch();
    } catch (error) {
      const message = getApiErrorMessage(error);
      setSubmitError(message);
      toast.error(message);
    }
  }

  return (
    <div className="space-y-6">
      <PageSectionHeader
        title="Leave"
        description={canReview ? "Review leave requests" : "Request and track leave"}
        action={
          !canReview ? (
            <Dialog
              open={open}
              onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) {
                  setSubmitError(null);
                  leaveForm.clearErrors();
                }
              }}
            >
              <DialogTrigger render={<Button />}>Request leave</DialogTrigger>
              <DialogContent>
              <DialogHeader>
                <DialogTitle>New leave request</DialogTitle>
              </DialogHeader>
              <Form {...leaveForm}>
                <form
                  className="space-y-4"
                  onSubmit={leaveForm.handleSubmit(handleLeaveSubmit)}
                >
                  <FormField
                    control={leaveForm.control}
                    name="leaveType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Leave type</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(v) =>
                              field.onChange(v && isLeaveType(v) ? v : "ANNUAL")
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={leaveForm.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={leaveForm.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={leaveForm.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Reason..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {submitError ? (
                    <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {submitError}
                    </div>
                  ) : null}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createState.isLoading || !leaveForm.formState.isValid}
                  >
                    {createState.isLoading ? "Submitting..." : "Submit request"}
                  </Button>
                </form>
              </Form>
              </DialogContent>
            </Dialog>
          ) : null
        }
      />

      <ChartSectionCard
        title="Leave request status chart"
        description="Approval and request distribution for current records"
      >
        <AttendanceStatusPie summary={leaveSummary} />
      </ChartSectionCard>

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
            {pageRows.length ? (
              pageRows.map((r) => (
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

      {rows.length ? (
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, rows.length)}
            </span>{" "}
            of <span className="font-medium text-foreground">{rows.length}</span>
          </div>
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive>{page}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}
    </div>
  );
}

