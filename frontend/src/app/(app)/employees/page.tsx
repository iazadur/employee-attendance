"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useCreateEmployeeMutation, useListEmployeesQuery } from "@/store/employeesApi";
import { useListShiftsQuery } from "@/store/shiftsApi";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SimpleBarChart } from "@/components/charts/SimpleBarChart";
import { ChartSectionCard } from "@/components/sections/ChartSectionCard";
import { PageSectionHeader } from "@/components/sections/PageSectionHeader";

const createEmployeeSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one number"),
  department: z.string().trim().min(1, "Department is required"),
  designation: z.string().trim().min(1, "Designation is required"),
  joinDate: z.string().trim().min(1, "Join date is required"),
  phone: z.string().trim().min(1, "Phone is required"),
  shiftId: z.string().trim().optional(),
});

type CreateEmployeeFormValues = z.infer<typeof createEmployeeSchema>;

export default function EmployeesPage() {
  const [page, setPage] = useState(1);
  const take = 10;
  const skip = (page - 1) * take;
  const employees = useListEmployeesQuery({ take, skip });
  const shifts = useListShiftsQuery();
  const [createEmployee, createState] = useCreateEmployeeMutation();
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<CreateEmployeeFormValues>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "Asdf@123",
      department: "",
      designation: "",
      joinDate: new Date().toISOString().slice(0, 10),
      phone: "",
      shiftId: "",
    },
    mode: "onChange",
  });

  const total = employees.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / take));
  const departmentData = Object.entries(
    (employees.data?.items ?? []).reduce<Record<string, number>>((acc, item) => {
      const key = item.department || "Unknown";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([label, value]) => ({ label, value }));

  function getApiErrorMessage(error: unknown): string {
    if (typeof error === "object" && error !== null && "data" in error) {
      const data = (error as { data?: unknown }).data;
      if (typeof data === "object" && data !== null) {
        if ("message" in data) {
          const message = (data as { message?: unknown }).message;
          if (Array.isArray(message)) {
            return message.filter((item) => typeof item === "string").join(", ");
          }
          if (typeof message === "string") return message;
        }
      }
    }
    return "Failed to create employee";
  }

  async function onSubmit(values: CreateEmployeeFormValues) {
    setSubmitError(null);
    try {
      const payload = {
        ...values,
        shiftId: values.shiftId?.trim() ? values.shiftId.trim() : undefined,
      };
      await createEmployee(payload).unwrap();
      toast.success("Employee created");
      setOpen(false);
      form.reset({
        email: "",
        name: "",
        password: "Asdf@123",
        department: "",
        designation: "",
        joinDate: new Date().toISOString().slice(0, 10),
        phone: "",
        shiftId: "",
      });
      employees.refetch();
    } catch (error) {
      const message = getApiErrorMessage(error);
      setSubmitError(message);
      toast.error(message);
    }
  }

  return (
    <div className="space-y-6">
      <PageSectionHeader
        title="Employees"
        description="Create and manage employee profiles"
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
            <DialogTrigger render={<Button />}>Add employee</DialogTrigger>
            <DialogContent>
            <DialogHeader>
              <DialogTitle>New employee</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="employee@company.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Employee Name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormDescription>
                        Use at least 8 chars with uppercase, lowercase and number.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="IT" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Developer" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="joinDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Join date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="01XXXXXXXXX" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="shiftId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shift ID (optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={shifts.data?.[0]?.id ?? "Create a shift first"}
                        />
                      </FormControl>
                      {shifts.data?.length ? (
                        <FormDescription>
                          Example shift: {shifts.data[0].id} ({shifts.data[0].name})
                        </FormDescription>
                      ) : null}
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
                  {createState.isLoading ? "Creating..." : "Create employee"}
                </Button>
              </form>
            </Form>
            </DialogContent>
          </Dialog>
        }
      />

      <ChartSectionCard
        title="Department distribution"
        description="Current page employee split by department"
      >
        <SimpleBarChart data={departmentData} />
      </ChartSectionCard>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Shift</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.data?.items?.length ? (
              employees.data.items.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-mono">{e.employeeCode}</TableCell>
                  <TableCell className="font-medium">{e.user.name}</TableCell>
                  <TableCell>{e.user.email}</TableCell>
                  <TableCell>{e.department}</TableCell>
                  <TableCell>{e.shift?.name ?? "-"}</TableCell>
                </TableRow>
              ))
            ) : employees.isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm">
                  No employees yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {total ? skip + 1 : 0}–{Math.min(skip + take, total)}
          </span>{" "}
          of <span className="font-medium text-foreground">{total}</span>
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
    </div>
  );
}

