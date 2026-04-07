"use client";

import { useMeQuery, useLogoutMutation } from "@/store/authApi";
import { Button } from "@/components/ui/button";
import { useCheckInMutation, useCheckOutMutation } from "@/store/attendanceApi";
import { toast } from "sonner";
import { useTodayKpisQuery } from "@/store/reportsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const me = useMeQuery();
  const [logout, logoutState] = useLogoutMutation();
  const [checkIn, checkInState] = useCheckInMutation();
  const [checkOut, checkOutState] = useCheckOutMutation();
  const kpis = useTodayKpisQuery(undefined, {
    skip: me.data?.user.role !== "ADMIN",
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
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
        <div className="mt-10 flex gap-3">
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
      ) : null}

      {me.data?.user.role === "ADMIN" ? (
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
    </div>
  );
}

