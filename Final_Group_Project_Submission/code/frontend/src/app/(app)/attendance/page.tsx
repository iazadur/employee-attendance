"use client";

import { useListAttendanceQuery } from "@/store/attendanceApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AttendancePage() {
  const attendance = useListAttendanceQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Attendance</h1>
        <p className="text-sm text-muted-foreground">Your attendance records</p>
      </div>

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
                  No records yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

