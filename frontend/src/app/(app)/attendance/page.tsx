"use client";

import { useMemo, useState } from "react";
import { useListAttendanceQuery } from "@/store/attendanceApi";
import { useMeQuery } from "@/store/authApi";
import { useListEmployeesQuery } from "@/store/employeesApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AttendancePage() {
  const me = useMeQuery();
  const role = me.data?.user.role;
  const isAdminOrManager = role === "ADMIN" || role === "MANAGER";

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [dateFrom, setDateFrom] = useState<string>(todayIso);
  const [dateTo, setDateTo] = useState<string>(todayIso);
  const [employeeId, setEmployeeId] = useState<string>("");

  const employees = useListEmployeesQuery(
    { take: 100 },
    { skip: !isAdminOrManager },
  );

  const attendance = useListAttendanceQuery(
    isAdminOrManager
      ? {
          employeeId: employeeId || undefined,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        }
      : undefined,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Attendance</h1>
          <p className="text-sm text-muted-foreground">
            {isAdminOrManager ? "Review attendance records" : "Your attendance records"}
          </p>
        </div>
      </div>

      {isAdminOrManager ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filters</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label>Employee</Label>
              <Select
                value={employeeId}
                onValueChange={(v) => setEmployeeId(v ?? "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All employees</SelectItem>
                  {(employees.data?.items ?? []).map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.user.name} ({e.employeeCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Date from</Label>
              <Input
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div className="grid gap-2">
              <Label>Date to</Label>
              <Input
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="YYYY-MM-DD"
              />
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Check in</TableHead>
              <TableHead>Check out</TableHead>
              <TableHead className="text-right">Total (min)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendance.data?.length ? (
              attendance.data.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">
                    {new Date(r.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{r.status}</TableCell>
                  <TableCell>
                    {r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : "-"}
                  </TableCell>
                  <TableCell>
                    {r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {r.totalMinutes ?? "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : attendance.isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm">
                  {isAdminOrManager && !employeeId
                    ? "No records match your filters"
                    : "No records yet"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

