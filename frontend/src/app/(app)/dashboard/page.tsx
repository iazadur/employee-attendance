"use client";

import { useMemo, useState } from "react";
import { useMeQuery, useLogoutMutation } from "@/store/authApi";
import { Button } from "@/components/ui/button";
import { useCheckInMutation, useCheckOutMutation } from "@/store/attendanceApi";
import { toast } from "sonner";
import { useMonthlyQuery, useTodayKpisQuery } from "@/store/reportsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceStatusPie } from "@/components/charts/AttendanceStatusPie";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const me = useMeQuery();
  const [logout, logoutState] = useLogoutMutation();
  const [checkIn, checkInState] = useCheckInMutation();
  const [checkOut, checkOutState] = useCheckOutMutation();

  const role = me.data?.user.role;
  const canSeeKpis = role === "ADMIN" || role === "MANAGER";
  const kpis = useTodayKpisQuery(undefined, { skip: !canSeeKpis });

  const now = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const monthly = useMonthlyQuery(
    { year, month },
    { skip: role !== "EMPLOYEE" },
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            {role ? <Badge variant="secondary">{role}</Badge> : null}
          </div>
          <p className="text-sm text-muted-foreground">
            Signed in as{" "}
            <span className="font-medium text-foreground">
              {me.data?.user.email}
            </span>
          </p>
        </div>
        <Button
          variant="outline"
          disabled={logoutState.isLoading}
          onClick={async () => {
            await logout().unwrap();
            window.location.href = "/login";
          }}
        >
          {logoutState.isLoading ? "Signing out..." : "Logout"}
        </Button>
      </div>

      {me.data?.user.role === "EMPLOYEE" ? (
        <div className="mt-10 rounded-2xl border bg-card p-4 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="text-sm font-medium">Today</div>
              <div className="text-sm text-muted-foreground">
                Check in/out to record your attendance
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                disabled={checkInState.isLoading}
                onClick={async () => {
                  try {
                    await checkIn().unwrap();
                    toast.success("Checked in");
                  } catch {
                    toast.error("Check-in failed");
                  }
                }}
              >
                {checkInState.isLoading ? "Checking in..." : "Check in"}
              </Button>
              <Button
                variant="secondary"
                disabled={checkOutState.isLoading}
                onClick={async () => {
                  try {
                    await checkOut().unwrap();
                    toast.success("Checked out");
                  } catch {
                    toast.error("Check-out failed");
                  }
                }}
              >
                {checkOutState.isLoading ? "Checking out..." : "Check out"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {canSeeKpis ? (
        <div className="mt-10 grid gap-4 md:grid-cols-3">
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
        </div>
      ) : null}

      {role === "EMPLOYEE" ? (
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
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
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

