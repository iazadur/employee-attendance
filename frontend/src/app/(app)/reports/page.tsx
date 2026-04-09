"use client";

import { useMemo, useState } from "react";
import { useMeQuery } from "@/store/authApi";
import { useListEmployeesQuery } from "@/store/employeesApi";
import { useMonthlyQuery, useTodayKpisQuery } from "@/store/reportsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceStatusPie } from "@/components/charts/AttendanceStatusPie";
import { SimpleBarChart } from "@/components/charts/SimpleBarChart";
import { ChartSectionCard } from "@/components/sections/ChartSectionCard";
import { PageSectionHeader } from "@/components/sections/PageSectionHeader";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ReportsPage() {
  const me = useMeQuery();
  const role = me.data?.user.role;
  const canSeeKpis = role === "ADMIN" || role === "MANAGER";

  const kpis = useTodayKpisQuery(undefined, { skip: !canSeeKpis });

  const now = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [employeeId, setEmployeeId] = useState<string>("");

  const employees = useListEmployeesQuery(
    { take: 100 },
    { skip: !canSeeKpis },
  );

  const monthly = useMonthlyQuery(
    canSeeKpis
      ? {
          year,
          month,
          employeeId: employeeId || undefined,
        }
      : {
          year,
          month,
        },
  );
  const todayData = [
    { label: "Present", value: kpis.data?.today.present ?? 0 },
    { label: "Late", value: kpis.data?.today.late ?? 0 },
    { label: "Half day", value: kpis.data?.today.halfDay ?? 0 },
    { label: "Pending leave", value: kpis.data?.pendingLeaves ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <PageSectionHeader
        title="Reports"
        description={
          canSeeKpis ? "Team overview and monthly breakdown" : "Monthly breakdown"
        }
      />

      {canSeeKpis ? (
        <div className="grid gap-4 md:grid-cols-3">
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

      {canSeeKpis ? (
        <ChartSectionCard
          title="Today performance trend"
          description="Team-level attendance indicators for the current day"
        >
          <SimpleBarChart data={todayData} />
        </ChartSectionCard>
      ) : null}

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle>Monthly breakdown</CardTitle>
            <div className="text-sm text-muted-foreground">
              Attendance statuses for the selected month
            </div>
          </div>
          <div className="grid w-full gap-3 md:w-auto md:grid-cols-3">
            {canSeeKpis ? (
              <div className="grid gap-2">
                <Label>Employee</Label>
                <Select
                  value={employeeId}
                  onValueChange={(v) => setEmployeeId(v ?? "")}
                >
                  <SelectTrigger className="w-full md:w-72">
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
            ) : null}
            <div className="grid gap-2">
              <Label>Month</Label>
              <select
                className="h-9 rounded-lg border bg-background px-2 text-sm"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label>Year</Label>
              <select
                className="h-9 rounded-lg border bg-background px-2 text-sm"
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
          </div>
        </CardHeader>
        <CardContent>
          <AttendanceStatusPie summary={monthly.data?.summary} />
        </CardContent>
      </Card>
    </div>
  );
}

