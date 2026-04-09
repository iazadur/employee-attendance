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

export default function AttendancePage() {
  const me = useMeQuery();
  const role = me.data?.user.role;
  const isAdminOrManager = role === "ADMIN" || role === "MANAGER";

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [dateFrom, setDateFrom] = useState<string>(todayIso);
  const [dateTo, setDateTo] = useState<string>(todayIso);
  const [employeeId, setEmployeeId] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

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

  const allRows = attendance.data ?? [];
  const statusSummary = allRows.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = (acc[row.status] ?? 0) + 1;
    return acc;
  }, {});
  const totalPages = Math.max(1, Math.ceil(allRows.length / pageSize));
  const pageRows = allRows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <PageSectionHeader
        title="Attendance"
        description={
          isAdminOrManager ? "Review attendance records" : "Your attendance records"
        }
      />

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

      <ChartSectionCard
        title="Attendance status chart"
        description="Visual overview for the selected attendance records"
      >
        <AttendanceStatusPie summary={statusSummary} />
      </ChartSectionCard>

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
            {pageRows.length ? (
              pageRows.map((r) => (
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

      {allRows.length ? (
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, allRows.length)}
            </span>{" "}
            of <span className="font-medium text-foreground">{allRows.length}</span>
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

