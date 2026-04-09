"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  useCreateShiftMutation,
  useListShiftsQuery,
  type CreateShiftPayload,
} from "@/store/shiftsApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  name: z.string().trim().min(2, "Shift name must be at least 2 characters"),
  startTime: z.string().trim().min(1, "Start time is required"),
  endTime: z.string().trim().min(1, "End time is required"),
  workingDays: z.string().trim().min(1, "Working days are required"),
  graceMinutes: z.number().min(0, "Grace minutes must be 0 or more"),
});

type CreateShiftFormValues = z.infer<typeof createShiftSchema>;

export default function ShiftsPage() {
  const shifts = useListShiftsQuery();
  const [createShift, createState] = useCreateShiftMutation();
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<CreateShiftFormValues>({
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
    return "Failed to create shift";
  }

  async function onSubmit(values: CreateShiftFormValues) {
    setSubmitError(null);
    try {
      const payload: CreateShiftPayload = {
        ...values,
      };
      await createShift(payload).unwrap();
      toast.success("Shift created");
      setOpen(false);
      form.reset({
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

  return (
    <div className="space-y-6">
      <PageSectionHeader
        title="Shifts"
        description="Create and manage working shifts"
        action={
          <Dialog
            open={open}
            onOpenChange={(isOpen) => {
              setOpen(isOpen);
              if (!isOpen) {
                setSubmitError(null);
                form.clearErrors();
              }
            }}
          >
            <DialogTrigger render={<Button />}>Add shift</DialogTrigger>
            <DialogContent>
            <DialogHeader>
              <DialogTitle>New shift</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Morning" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="09:00" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="17:00" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="workingDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Working days</FormLabel>
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
                  control={form.control}
                  name="graceMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grace minutes</FormLabel>
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
                  disabled={createState.isLoading || !form.formState.isValid}
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

