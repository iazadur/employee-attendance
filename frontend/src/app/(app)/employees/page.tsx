"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCreateEmployeeMutation, useListEmployeesQuery } from "@/store/employeesApi";
import { useListShiftsQuery } from "@/store/shiftsApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function EmployeesPage() {
  const [page, setPage] = useState(1);
  const take = 10;
  const skip = (page - 1) * take;
  const employees = useListEmployeesQuery({ take, skip });
  const shifts = useListShiftsQuery();
  const [createEmployee, createState] = useCreateEmployeeMutation();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "employee123",
    department: "",
    designation: "",
    joinDate: new Date().toISOString().slice(0, 10),
    phone: "",
    shiftId: "",
  });

  const total = employees.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / take));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage employee profiles
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>Add employee</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New employee</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                  placeholder="employee@company.com"
                />
              </div>
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Employee Name"
                />
              </div>
              <div className="grid gap-2">
                <Label>Password</Label>
                <Input
                  value={form.password}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, password: e.target.value }))
                  }
                  type="password"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Department</Label>
                  <Input
                    value={form.department}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, department: e.target.value }))
                    }
                    placeholder="IT"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Designation</Label>
                  <Input
                    value={form.designation}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, designation: e.target.value }))
                    }
                    placeholder="Developer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Join date</Label>
                  <Input
                    value={form.joinDate}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, joinDate: e.target.value }))
                    }
                    placeholder="YYYY-MM-DD"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Phone</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                    placeholder="01XXXXXXXXX"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Shift ID (optional)</Label>
                <Input
                  value={form.shiftId}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, shiftId: e.target.value }))
                  }
                  placeholder={shifts.data?.[0]?.id ?? "Create a shift first"}
                />
                {shifts.data?.length ? (
                  <div className="text-xs text-muted-foreground">
                    Example shift: <span className="font-mono">{shifts.data[0].id}</span>{" "}
                    ({shifts.data[0].name})
                  </div>
                ) : null}
              </div>

              <Button
                className="w-full"
                disabled={createState.isLoading}
                onClick={async () => {
                  try {
                    const payload = {
                      ...form,
                      shiftId: form.shiftId ? form.shiftId : undefined,
                    };
                    await createEmployee(payload).unwrap();
                    toast.success("Employee created");
                    setOpen(false);
                    employees.refetch();
                  } catch {
                    toast.error("Failed to create employee");
                  }
                }}
              >
                {createState.isLoading ? "Creating..." : "Create employee"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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

