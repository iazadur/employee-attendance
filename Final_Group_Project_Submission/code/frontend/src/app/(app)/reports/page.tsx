"use client";

import { useTodayKpisQuery } from "@/store/reportsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  const kpis = useTodayKpisQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">Today’s overview</p>
      </div>

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
    </div>
  );
}

