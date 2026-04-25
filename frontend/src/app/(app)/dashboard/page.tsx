"use client";

import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useMeQuery } from "@/store/authApi";
import { Button } from "@/components/ui/button";
import { useCheckInMutation, useCheckOutMutation, useTodayAttendanceQuery } from "@/store/attendanceApi";
import { toast } from "sonner";
import { useMonthlyQuery, useTodayKpisQuery } from "@/store/reportsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceStatusPie } from "@/components/charts/AttendanceStatusPie";
import { SimpleBarChart } from "@/components/charts/SimpleBarChart";
import { Badge } from "@/components/ui/badge";
import { ChartSectionCard } from "@/components/sections/ChartSectionCard";
import { PageSectionHeader } from "@/components/sections/PageSectionHeader";

export default function DashboardPage() {
  const me = useMeQuery();
  const [checkIn, checkInState] = useCheckInMutation();
  const [checkOut, checkOutState] = useCheckOutMutation();
  const today = new Date();
  const todayDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
  const { data: todayAttendance } = useTodayAttendanceQuery(
    { date: todayDate },
    { skip: !me.data?.user.id }
  );
  const role = me.data?.user.role;
  const canSeeKpis = role === "ADMIN" || role === "MANAGER";
   const kpis = useTodayKpisQuery({}, { skip: !canSeeKpis });

  const now = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const monthly = useMonthlyQuery(
    { year, month },
    { skip: role !== "EMPLOYEE" },
  );

  const todayTotal = kpis.data?.totalEmployees ?? 0;
  const todayPresent = kpis.data?.today.present ?? 0;
  const todayRecorded = kpis.data?.today.recorded ?? 0;
  const presenceRate = todayTotal > 0 ? Math.round((todayPresent / todayTotal) * 100) : 0;
  const recordingRate =
    todayTotal > 0 ? Math.round((todayRecorded / todayTotal) * 100) : 0;

  const todayBreakdown = [
    { label: "Present", value: kpis.data?.today.present ?? 0 },
    { label: "Late", value: kpis.data?.today.late ?? 0 },
    { label: "Half day", value: kpis.data?.today.halfDay ?? 0 },
    { label: "Recorded", value: kpis.data?.today.recorded ?? 0 },
  ];

  const monthlySummaryEntries = Object.entries(monthly.data?.summary ?? {})
    .filter(([, value]) => typeof value === "number" && value > 0)
    .map(([label, value]) => ({ label, value }));

  // Determine button states based on attendance record
  const isCheckedIn = Boolean(todayAttendance?.checkIn);
  const isCheckedOut = Boolean(todayAttendance?.checkOut);

  const getApiErrorMessage = (error: unknown) => {
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
  };

  // Helper function to get status badge
  const getStatusBadge = (status: string | null | undefined) => {
    if (!status) return "No record";
    switch (status) {
      case "PRESENT":
        return "On Time";
      case "LATE":
        return "Late";
      case "HALF_DAY":
        return "Half Day";
      case "ABSENT":
        return "Absent";
      default:
        return status;
    }
  };

  const formatAttendanceTime = (value: string | null) => {
    if (!value) return null;

    return dayjs(value).format("hh:mm A");
  };

  return (
    <div className="w-full space-y-6 px-1 py-1 md:px-2">
      <PageSectionHeader
        title="Dashboard"
        description={`Signed in as ${me.data?.user.email ?? "user"}`}
        action={role ? <Badge variant="secondary">{role}</Badge> : null}
      />

      {me.data?.user.role === "EMPLOYEE" ? (
        <div className="rounded-2xl border bg-card p-4 shadow-sm transition-all duration-300 ease-out">
          <div className="flex items-center justify-between gap-3 border-b pb-3 transition-colors duration-300">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Today
              </div>
              <div className="text-sm font-semibold text-foreground">
                Attendance snapshot
              </div>
            </div>
            <div className="rounded-full border bg-white px-3 py-1 text-xs font-medium text-muted-foreground transition-all duration-300">
              {todayAttendance ? getStatusBadge(todayAttendance.status) : "No record yet"}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border bg-white p-3 transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                  ⏰
                </span>
                Check-in
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground">
                {formatAttendanceTime(todayAttendance?.checkIn ?? null) ? (
                  <span className="font-mono">
                    {formatAttendanceTime(todayAttendance?.checkIn ?? null)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Not checked in</span>
                )}
              </div>
            </div>

            <div className="rounded-xl border bg-white p-3 transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary/40 text-foreground">
                  ⏰
                </span>
                Check-out
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground">
                {formatAttendanceTime(todayAttendance?.checkOut ?? null) ? (
                  <span className="font-mono">
                    {formatAttendanceTime(todayAttendance?.checkOut ?? null)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Not checked out</span>
                )}
              </div>
            </div>

            <div className="rounded-xl border bg-white p-3 transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-foreground">
                  📊
                </span>
                Status
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground">
                {todayAttendance ? getStatusBadge(todayAttendance.status) : "Pending"}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Button
              className="w-full"
              size="lg"
              disabled={isCheckedIn || checkInState.isLoading || checkOutState.isLoading}
              onClick={async () => {
                try {
                  await checkIn().unwrap();
                  toast.success("Checked in successfully");
                } catch (error) {
                  toast.error(getApiErrorMessage(error));
                }
              }}
            >
              {isCheckedIn ? "Checked in" : checkInState.isLoading ? "Checking in..." : "Check In"}
            </Button>
            <Button
              className="w-full"
              variant="secondary"
              size="lg"
              disabled={!isCheckedIn || isCheckedOut || checkInState.isLoading || checkOutState.isLoading}
              onClick={async () => {
                try {
                  await checkOut().unwrap();
                  toast.success("Checked out successfully");
                } catch (error) {
                  toast.error(getApiErrorMessage(error));
                }
              }}
            >
              {isCheckedOut ? "Completed" : checkOutState.isLoading ? "Checking out..." : "Check Out"}
            </Button>
          </div>
        </div>
      ) : null}

      {canSeeKpis ? (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total employees</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">
              {kpis.data?.totalEmployees ?? (kpis.isLoading ? "…" : "—")}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Present today</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">
              {kpis.data?.today.present ?? (kpis.isLoading ? "…" : "—")}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending leaves</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">
              {kpis.data?.pendingLeaves ?? (kpis.isLoading ? "…" : "—")}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Presence rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{presenceRate}%</div>
              <div className="mt-2 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.min(presenceRate, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {canSeeKpis ? (
        <div className="grid gap-4 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <ChartSectionCard
              title="Today attendance trend"
              description="Quick visual breakdown of team attendance statuses"
            >
              <SimpleBarChart data={todayBreakdown} />
            </ChartSectionCard>
          </div>
          <div className="xl:col-span-2">
            <ChartSectionCard
              title="Attendance mix"
              description="Status distribution for today"
            >
              <AttendanceStatusPie
                summary={{
                  PRESENT: kpis.data?.today.present ?? 0,
                  LATE: kpis.data?.today.late ?? 0,
                  HALF_DAY: kpis.data?.today.halfDay ?? 0,
                }}
              />
            </ChartSectionCard>
          </div>
        </div>
      ) : null}

      {role === "EMPLOYEE" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <CardTitle>Monthly summary</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Breakdown of your attendance statuses
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <select
                  className="h-9 rounded-md border bg-background px-2"
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  className="h-9 rounded-md border bg-background px-2"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                >
                  {Array.from({ length: 5 }, (_, i) => now.getFullYear() - i).map(
                    (y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <AttendanceStatusPie summary={monthly.data?.summary} />
            </CardContent>
          </Card>

          <ChartSectionCard
            title="Monthly trend"
            description="Interactive month-wise status counts"
          >
            <SimpleBarChart data={monthlySummaryEntries} />
          </ChartSectionCard>

          <Card>
            <CardHeader>
              <CardTitle>What’s next</CardTitle>
              <div className="text-sm text-muted-foreground">
                Quick guidance for common actions
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-xl border bg-muted/10 p-3">
                Use <span className="font-medium">Attendance</span> to verify
                today’s record.
              </div>
              <div className="rounded-xl border bg-muted/10 p-3">
                Use <span className="font-medium">Leave</span> to request leave
                and track approval status.
              </div>
              <div className="rounded-xl border bg-muted/10 p-3">
                Keep your check-in and check-out within your assigned shift.
              </div>
              <div className="rounded-xl border bg-muted/10 p-3">
                Current month record completion:{" "}
                <span className="font-medium">{recordingRate}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

