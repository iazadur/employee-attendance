"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMeQuery } from "@/store/authApi";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const me = useMeQuery();

  useEffect(() => {
    if (me.isLoading) return;
    if (me.isError) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [me.isLoading, me.isError, router, pathname]);

  if (me.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (me.isError) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <aside className="hidden w-64 flex-col border-r bg-muted/20 p-4 md:flex">
          <div className="px-2 py-3 text-sm font-semibold">
            Employee Attendance
          </div>
          <nav className="mt-2 flex flex-col gap-1">
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({
                  variant: pathname === "/dashboard" ? "default" : "ghost",
                }),
                "justify-start",
              )}
            >
              Dashboard
            </Link>
            {me.data?.user.role === "ADMIN" ? (
              <>
                <Link
                  href="/employees"
                  className={cn(
                    buttonVariants({
                      variant: pathname === "/employees" ? "default" : "ghost",
                    }),
                    "justify-start",
                  )}
                >
                  Employees
                </Link>
                <Link
                  href="/shifts"
                  className={cn(
                    buttonVariants({
                      variant: pathname === "/shifts" ? "default" : "ghost",
                    }),
                    "justify-start",
                  )}
                >
                  Shifts
                </Link>
              </>
            ) : null}
            <Link
              href="/attendance"
              className={cn(
                buttonVariants({
                  variant: pathname === "/attendance" ? "default" : "ghost",
                }),
                "justify-start",
              )}
            >
              Attendance
            </Link>
            <Link
              href="/leave"
              className={cn(
                buttonVariants({
                  variant: pathname === "/leave" ? "default" : "ghost",
                }),
                "justify-start",
              )}
            >
              Leave
            </Link>
            {me.data?.user.role === "ADMIN" ? (
              <Link
                href="/reports"
                className={cn(
                  buttonVariants({
                    variant: pathname === "/reports" ? "default" : "ghost",
                  }),
                  "justify-start",
                )}
              >
                Reports
              </Link>
            ) : null}
          </nav>
          <div className="mt-auto px-2 pt-4 text-xs text-muted-foreground">
            Signed in as {me.data?.user.email}
          </div>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

