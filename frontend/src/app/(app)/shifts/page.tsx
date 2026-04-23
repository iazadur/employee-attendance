"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  useCreateShiftMutation,
  useListShiftsQuery,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
  type CreateShiftPayload,
  type Shift,
} from "@/store/shiftsApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SimpleBarChart } from "@/components/charts/SimpleBarChart";
import { ChartSectionCard } from "@/components/sections/ChartSectionCard";
import { PageSectionHeader } from "@/components/sections/PageSectionHeader";

const createShiftSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Shift name is required")
    .min(2, "Shift name must be at least 2 characters"),
  startTime: z.string().trim().min(1, "Start time is required"),
  endTime: z.string().trim().min(1, "End time is required"),
  workingDays: z.string().trim().min(1, "Working days are required"),
  graceMinutes: z.number().min(0, "Grace minutes must be 0 or more"),
});

type CreateShiftFormValues = z.infer<typeof createShiftSchema>;

export default function ShiftsPage() {
  const shifts = useListShiftsQuery();
  const [createShift, createState] = useCreateShiftMutation();
  const [updateShift, updateState] = useUpdateShiftMutation();
  const [deleteShift] = useDeleteShiftMutation();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fieldLabels: Record<keyof CreateShiftFormValues, string> = {
    name: "Name",
    startTime: "Start",
    endTime: "End",
    workingDays: "Working days",
    graceMinutes: "Grace minutes",
  };

  const createForm = useForm<CreateShiftFormValues>({
    resolver: zodResolver(createShiftSchema),
    defaultValues: {
      name: "",
      startTime: "09:00",
      endTime: "17:00",
      workingDays: "Mon,Tue,Wed,Thu,Fri",
      graceMinutes: 15,
    },
    mode: "onChange",
  });

  const editForm = useForm<CreateShiftFormValues>({
    resolver: zodResolver(createShiftSchema),
    defaultValues: {
      name: "",
      startTime: "09:00",
      endTime: "17:00",
      workingDays: "Mon,Tue,Wed,Thu,Fri",
      graceMinutes: 15,
    },
    mode: "onChange",
  });

  const graceData = (shifts.data ?? []).map((s) => ({
    label: s.name,
    value: s.graceMinutes ?? 0,
  }));

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
    return "Operation failed";
  }

  async function onCreateSubmit(values: CreateShiftFormValues) {
    setSubmitError(null);
    try {
      const payload: CreateShiftPayload = { ...values };
      await createShift(payload).unwrap();
      toast.success("Shift created");
      setOpenCreate(false);
      createForm.reset({
        name: "",
        startTime: "09:00",
        endTime: "17:00",
        workingDays: "Mon,Tue,Wed,Thu,Fri",
        graceMinutes: 15,
      });
      shifts.refetch();
    } catch (error) {
      const message = getApiErrorMessage(error);
      setSubmitError(message);
      toast.error(message);
    }
  }

  async function onEditSubmit(values: CreateShiftFormValues) {
    if (!editingShift) return;
    setSubmitError(null);
    try {
      await updateShift({
        id: editingShift.id,
        data: values,
      }).unwrap();
      toast.success("Shift updated");
      setOpenEdit(false);
      setEditingShift(null);
      shifts.refetch();
    } catch (error) {
      const message = getApiErrorMessage(error);
      setSubmitError(message);
      toast.error(message);
    }
  }

  function onInvalid(errors: Partial<Record<keyof CreateShiftFormValues, unknown>>) {
    const errorKeys = Object.keys(errors) as Array<keyof CreateShiftFormValues>;
    const fieldList = errorKeys.map((key) => fieldLabels[key]).join(", ");
    setSubmitError(
      fieldList
        ? `Please complete or correct: ${fieldList}.`
        : "Please complete all required fields.",
    );
    if (errorKeys.length > 0) {
      (errorKeys[0] === 'name' ? createForm : editForm).setFocus(errorKeys[0]);
    }
  }

  function openEditDialog(shift: Shift) {
    setEditingShift(shift);
    editForm.reset({
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
      workingDays: shift.workingDays,
      graceMinutes: shift.graceMinutes,
    });
    setOpenEdit(true);
  }

  function openDeleteDialog(shift: Shift) {
    if (confirm(`Delete shift "${shift.name}"? This cannot be undone.`)) {
      deleteShift(shift.id)
        .unwrap()
        .then(() => {
          toast.success("Shift deleted");
          shifts.refetch();
        })
        .catch((error) => {
          const message = getApiErrorMessage(error);
          toast.error(message);
        });
    }
  }

  return (
    <div className="space-y-6">
      <PageSectionHeader
        title="Shifts"
        description="Create and manage working shifts"
        action={
          <Dialog
            open={openCreate}
            onOpenChange={(isOpen) => {
              setOpenCreate(isOpen);
              if (!isOpen) {
                setSubmitError(null);
                createForm.clearErrors();
              }
            }}
          >
            <DialogTrigger render={<Button />}>Add shift</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New shift</DialogTitle>
              </DialogHeader>
              <Form {...createForm}>
                <form className="space-y-4" onSubmit={createForm.handleSubmit(onCreateSubmit, onInvalid)}>
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Morning" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={createForm.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="09:00" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="17:00" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={createForm.control}
                    name="workingDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Working days *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Mon,Tue,Wed,Thu,Fri" />
                        </FormControl>
                        <FormDescription>
                          Comma separated values, e.g. Mon,Tue,Wed,Thu,Fri
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="graceMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grace minutes *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            inputMode="numeric"
                            value={String(field.value)}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value || 0))
                            }
                          />
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
                    disabled={createState.isLoading}
                  >
                    {createState.isLoading ? "Creating..." : "Create shift"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        }
      />

      <ChartSectionCard
        title="Grace minutes by shift"
        description="Compare grace configuration across defined shifts"
      >
        <SimpleBarChart data={graceData} />
      </ChartSectionCard>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Days</TableHead>
              <TableHead className="text-right">Grace</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(s)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteDialog(s)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : shifts.isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm">
                  No shifts yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Shift Dialog */}
      <Dialog
        open={openEdit}
        onOpenChange={(isOpen) => {
          setOpenEdit(isOpen);
          if (!isOpen) {
            setEditingShift(null);
            setSubmitError(null);
            editForm.clearErrors();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit shift</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form className="space-y-4" onSubmit={editForm.handleSubmit(onEditSubmit, onInvalid)}>
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Morning" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={editForm.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="09:00" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="17:00" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="workingDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Working days *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Mon,Tue,Wed,Thu,Fri" />
                    </FormControl>
                    <FormDescription>
                      Comma separated values, e.g. Mon,Tue,Wed,Thu,Fri
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="graceMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grace minutes *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="numeric"
                        value={String(field.value)}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value || 0))
                        }
                      />
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
                disabled={updateState.isLoading}
              >
                {updateState.isLoading ? "Saving..." : "Save changes"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

