"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateShiftMutation,
  useListShiftsQuery,
  type CreateShiftPayload,
} from "@/store/shiftsApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ShiftsPage() {
  const shifts = useListShiftsQuery();
  const [createShift, createState] = useCreateShiftMutation();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<CreateShiftPayload>({
    name: "",
    startTime: "09:00",
    endTime: "17:00",
    workingDays: "Mon,Tue,Wed,Thu,Fri",
    graceMinutes: 15,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Shifts</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage working shifts
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>Add shift</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New shift</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Morning"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Start</Label>
                  <Input
                    value={form.startTime}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, startTime: e.target.value }))
                    }
                    placeholder="09:00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End</Label>
                  <Input
                    value={form.endTime}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, endTime: e.target.value }))
                    }
                    placeholder="17:00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Working days</Label>
                <Input
                  value={form.workingDays}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, workingDays: e.target.value }))
                  }
                  placeholder="Mon,Tue,Wed,Thu,Fri"
                />
              </div>
              <div className="space-y-2">
                <Label>Grace minutes</Label>
                <Input
                  inputMode="numeric"
                  value={String(form.graceMinutes)}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      graceMinutes: Number(e.target.value || 0),
                    }))
                  }
                />
              </div>

              <Button
                className="w-full"
                disabled={createState.isLoading}
                onClick={async () => {
                  try {
                    await createShift(form).unwrap();
                    toast.success("Shift created");
                    setOpen(false);
                    shifts.refetch();
                  } catch {
                    toast.error("Failed to create shift");
                  }
                }}
              >
                {createState.isLoading ? "Creating..." : "Create shift"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Days</TableHead>
              <TableHead className="text-right">Grace</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.data?.length ? (
              shifts.data.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.startTime}</TableCell>
                  <TableCell>{s.endTime}</TableCell>
                  <TableCell>{s.workingDays}</TableCell>
                  <TableCell className="text-right">{s.graceMinutes}</TableCell>
                </TableRow>
              ))
            ) : shifts.isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm">
                  No shifts yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

