"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  CalendarCheck,
  FileText,
  LayoutDashboard,
  Menu,
  Settings2,
  Users,
  X,
} from "lucide-react";

import { useMeQuery, useLogoutMutation } from "@/store/authApi";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { href: "/employees", label: "Employees", roles: ["ADMIN"] },
  { href: "/shifts", label: "Shifts", roles: ["ADMIN"] },
  { href: "/attendance", label: "Attendance", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { href: "/leave", label: "Leave", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { href: "/reports", label: "Reports", roles: ["ADMIN", "MANAGER"] },
] as const;

const navIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "/dashboard": LayoutDashboard,
  "/employees": Users,
  "/shifts": Settings2,
  "/attendance": CalendarCheck,
  "/leave": FileText,
  "/reports": BarChart3,
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const me = useMeQuery();
  const [logout, logoutState] = useLogoutMutation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (me.isLoading) return;
    if (me.isError) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [me.isLoading, me.isError, router, pathname]);

  // Close mobile nav on route change (handled by Link effect via pathname)

  if (me.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (me.isError) return null;

  const role = me.data?.user.role;

  const visibleNav = navItems.filter((item) =>
    role ? (item.roles as readonly string[]).includes(role) : false,
  );

  const initials =
    me.data?.user.name
      ?.split(" ")
      .map((p) => p[0])
      .join("") ?? me.data?.user.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="h-dvh w-full bg-white">
      <div className="flex h-dvh w-full flex-col md:flex-row">
        {/* Desktop sidebar */}
        <aside className="hidden h-dvh w-[320px] shrink-0 flex-col border-r border-sidebar-border bg-white p-4 md:flex">
          <div className="rounded-2xl border border-sidebar-border bg-white px-3 py-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15">
                <LayoutDashboard className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold tracking-tight">
                  Employee Attendance
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  Academic dashboard
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 px-1 text-xs font-medium text-muted-foreground">
            Navigation
          </div>
          <nav className="mt-2 flex flex-col gap-1">
            {visibleNav.map((item) => {
              const active = pathname === item.href;
              const Icon = navIcons[item.href] ?? FileText;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all",
                    "hover:bg-sidebar-accent/55 hover:text-foreground",
                    active
                      ? "bg-sidebar-accent text-foreground shadow-sm ring-1 ring-sidebar-border"
                      : "text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-lg ring-1 transition-colors",
                      active
                        ? "bg-primary/12 text-primary ring-primary/15"
                        : "bg-white text-muted-foreground ring-sidebar-border group-hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {active ? (
                    <span className="absolute inset-y-2 left-1 w-1 rounded-full bg-primary/80" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-4">
            <div className="rounded-2xl border border-sidebar-border bg-white p-3 shadow-sm">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[0.75rem] font-semibold text-primary ring-1 ring-primary/15">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-xs font-medium text-foreground">
                    {me.data?.user.email}
                  </div>
                  {role ? (
                    <div className="truncate text-[0.65rem] uppercase text-muted-foreground">
                      {role}
                    </div>
                  ) : null}
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-3 w-full"
                disabled={logoutState.isLoading}
                onClick={async () => {
                  await logout().unwrap();
                  window.location.href = "/login";
                }}
              >
                {logoutState.isLoading ? "Signing out..." : "Logout"}
              </Button>
            </div>
          </div>
        </aside>

        {/* Right side: top bar + content */}
        <div className="flex h-dvh min-w-0 flex-1 flex-col">
          {/* Top bar */}
          <header className="sticky top-0 sm:hidden z-40 flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-white px-4 md:px-6">
            <div className="flex items-center gap-2 md:hidden">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Toggle navigation"
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
              </Button>
              <div className="text-sm font-semibold tracking-tight">
                Employee Attendance
              </div>
            </div>
            <div className="hidden items-center gap-2">
              <div className="text-sm font-semibold tracking-tight">
                Employee Attendance
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[0.75rem] font-semibold text-primary">
                  {initials}
                </div>
                <div className="flex flex-col">
                  <span className="max-w-40 truncate text-[0.8rem] font-medium text-foreground">
                    {me.data?.user.email}
                  </span>
                  {role ? (
                    <span className="uppercase text-[0.65rem] leading-tight">
                      {role}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          {/* Mobile nav drawer */}
          {mobileOpen && visibleNav.length ? (
            <nav className="border-b bg-white px-4 pb-3 pt-2 text-sm shadow-sm md:hidden">
              <div className="flex flex-col gap-1">
                {visibleNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      buttonVariants({
                        variant: pathname === item.href ? "default" : "ghost",
                      }),
                      "justify-start transition-colors",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <Button
                variant="outline"
                className="mt-3 w-full"
                disabled={logoutState.isLoading}
                onClick={async () => {
                  await logout().unwrap();
                  window.location.href = "/login";
                }}
              >
                {logoutState.isLoading ? "Signing out..." : "Logout"}
              </Button>
            </nav>
          ) : null}

          {/* Page content with transition */}
          <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

