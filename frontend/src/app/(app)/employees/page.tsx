"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useCreateEmployeeMutation, useListEmployeesQuery, useUpdateEmployeeMutation } from "@/store/employeesApi";
import type { EmployeeListItem } from "@/store/employeesApi";
import { useListShiftsQuery } from "@/store/shiftsApi";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  password: z
    .string()
    .min(1, "Password is required")
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

const updateEmployeeSchema = z.object({
  department: z.string().trim().min(1, "Department is required"),
  designation: z.string().trim().min(1, "Designation is required"),
  joinDate: z.string().trim().min(1, "Join date is required"),
  phone: z.string().trim().min(1, "Phone is required"),
  shiftId: z.string().optional(),
  profilePhoto: z.string().optional().nullable(),
});

type CreateEmployeeFormValues = z.infer<typeof createEmployeeSchema>;
type UpdateEmployeeFormValues = z.infer<typeof updateEmployeeSchema>;

export default function EmployeesPage() {
  const [page, setPage] = useState(1);
  const take = 10;
  const skip = (page - 1) * take;

  const employees = useListEmployeesQuery({ take, skip });
  const shifts = useListShiftsQuery();
  const [createEmployee, createState] = useCreateEmployeeMutation();
  const [updateEmployee, updateState] = useUpdateEmployeeMutation();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<{
    id: string;
    department: string;
    designation: string;
    joinDate: string;
    phone: string;
    shiftId: string | null;
    profilePhoto: string | null;
  } | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const fieldLabels: Record<keyof CreateEmployeeFormValues, string> = {
    email: "Email",
    name: "Name",
    password: "Password",
    department: "Department",
    designation: "Designation",
    joinDate: "Join date",
    phone: "Phone",
    shiftId: "Shift",
  };

  const createForm = useForm<CreateEmployeeFormValues>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      department: "",
      designation: "",
      joinDate: new Date().toISOString().slice(0, 10),
      phone: "",
      shiftId: "",
    },
    mode: "onChange",
  });

  const editForm = useForm<UpdateEmployeeFormValues>({
    resolver: zodResolver(updateEmployeeSchema),
    defaultValues: {
      department: "",
      designation: "",
      joinDate: new Date().toISOString().slice(0, 10),
      phone: "",
      shiftId: "",
      profilePhoto: "",
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
    return "Operation failed";
  }

  async function onCreateSubmit(values: CreateEmployeeFormValues) {
    setSubmitError(null);
    try {
      const payload = {
        ...values,
        shiftId: values.shiftId?.trim() ? values.shiftId.trim() : undefined,
      };
      await createEmployee(payload).unwrap();
      toast.success("Employee created");
      setOpenCreate(false);
      createForm.reset({
        email: "",
        name: "",
        password: "",
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

  async function onEditSubmit(values: UpdateEmployeeFormValues) {
    if (!editingEmployee) return;
    setSubmitError(null);
    try {
      await updateEmployee({
        id: editingEmployee.id,
        data: {
          ...values,
          shiftId: values.shiftId === "" ? null : values.shiftId,
          profilePhoto: values.profilePhoto === "" ? null : values.profilePhoto,
        },
      }).unwrap();
      toast.success("Employee updated");
      setOpenEdit(false);
      setEditingEmployee(null);
      employees.refetch();
    } catch (error) {
      const message = getApiErrorMessage(error);
      setSubmitError(message);
      toast.error(message);
    }
  }

  function onInvalid(errors: Partial<Record<keyof CreateEmployeeFormValues, unknown>>) {
    const errorKeys = Object.keys(errors) as Array<keyof CreateEmployeeFormValues>;
    const requiredFields = errorKeys.filter((key) => key !== "shiftId");
    const fieldList = requiredFields.map((key) => fieldLabels[key]).join(", ");
    setSubmitError(
      fieldList
        ? `Please complete or correct: ${fieldList}.`
        : "Please complete all required fields.",
    );
    if (errorKeys.length > 0) {
      createForm.setFocus(errorKeys[0]);
    }
  }

  function openEditDialog(emp: EmployeeListItem) {
    setEditingEmployee({
      id: emp.id,
      department: emp.department,
      designation: emp.designation,
      joinDate: emp.joinDate.slice(0, 10),
      phone: emp.phone,
      shiftId: emp.shiftId,
      profilePhoto: null,
    });
    editForm.reset({
      department: emp.department,
      designation: emp.designation,
      joinDate: emp.joinDate.slice(0, 10),
      phone: emp.phone,
      shiftId: emp.shiftId ?? "",
      profilePhoto: "",
    });
    setOpenEdit(true);
  }

  return (
    <div className="space-y-6">
      <PageSectionHeader
        title="Employees"
        description="Create and manage employee profiles"
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
            <DialogTrigger render={<Button />}>Add employee</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New employee</DialogTitle>
              </DialogHeader>
              <Form {...createForm}>
                <form className="grid gap-4" onSubmit={createForm.handleSubmit(onCreateSubmit, onInvalid)}>
                  <FormField
                    control={createForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="employee@company.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Employee Name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password *</FormLabel>
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
                      control={createForm.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="IT" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="designation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Designation *</FormLabel>
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
                      control={createForm.control}
                      name="joinDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Join date *</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="01XXXXXXXXX" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={createForm.control}
                    name="shiftId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shift</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a shift (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {(shifts.data ?? []).map((s) => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.name} ({s.startTime}–{s.endTime})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {shifts.data?.length ? (
                          <FormDescription>
                            Assign a shift or leave empty for none
                          </FormDescription>
                        ) : (
                          <FormDescription>
                            No shifts defined. Create a shift first.
                          </FormDescription>
                        )}
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
              <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(e)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : employees.isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm">
                  No employees yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Employee Dialog */}
      <Dialog
        open={openEdit}
        onOpenChange={(isOpen) => {
          setOpenEdit(isOpen);
          if (!isOpen) {
            setEditingEmployee(null);
            setSubmitError(null);
            editForm.clearErrors();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit employee</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form className="grid gap-4" onSubmit={editForm.handleSubmit(onEditSubmit)}>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={editForm.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="IT" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation *</FormLabel>
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
                  control={editForm.control}
                  name="joinDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Join date *</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="01XXXXXXXXX" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="shiftId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a shift" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {(shifts.data ?? []).map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name} ({s.startTime}–{s.endTime})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Assign a shift to this employee
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="profilePhoto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile photo URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="https://example.com/photo.jpg"
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