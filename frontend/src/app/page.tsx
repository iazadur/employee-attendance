

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMeQuery } from "@/store/authApi";

export default function Home() {
  const router = useRouter();
  const me = useMeQuery();

  useEffect(() => {
    if (me.isLoading) return;
    if (me.data?.user) {
      router.replace("/dashboard");
      return;
    }
    router.replace("/login");
  }, [me.isLoading, me.data?.user, router]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background text-sm text-muted-foreground">
      Redirecting...
    </div>
  );
}



// "use client";

// import Link from "next/link";
// import { motion } from "framer-motion";
// import {
//   ArrowRight,
//   BarChart3,
//   CalendarCheck2,
//   ClipboardList,
//   ShieldCheck,
//   Users2,
// } from "lucide-react";

// import { buttonVariants } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useMeQuery } from "@/store/authApi";

// const features = [
//   {
//     title: "Attendance Tracking",
//     description:
//       "Daily check-in and check-out with status visibility for teams and administrators.",
//     icon: CalendarCheck2,
//   },
//   {
//     title: "Leave Management",
//     description:
//       "Simple leave request flow with review actions and real-time status updates.",
//     icon: ClipboardList,
//   },
//   {
//     title: "Shift & Team Control",
//     description:
//       "Organize departments, assign shifts, and maintain clear employee structure.",
//     icon: Users2,
//   },
//   {
//     title: "Insightful Reports",
//     description:
//       "See monthly summaries and key operational indicators through modern charts.",
//     icon: BarChart3,
//   },
// ] as const;

// export default function Home() {
//   const me = useMeQuery();
//   const isLoggedIn = Boolean(me.data?.user);

//   return (
//     <div className="min-h-dvh bg-background">
//       <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
//         <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 md:px-6">
//           <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
//             <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
//               <ShieldCheck className="size-4" />
//             </div>
//             Employee Attendance
//           </div>
//           <div className="flex items-center gap-2">
//             <Link
//               href="/login"
//               className={buttonVariants({ variant: "outline", size: "sm" })}
//             >
//               Login
//             </Link>
//             {isLoggedIn ? (
//               <Link href="/dashboard" className={buttonVariants({ size: "sm" })}>
//                 Dashboard
//               </Link>
//             ) : null}
//           </div>
//         </div>
//       </header>

//       <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-16">
//         <section className="grid items-center gap-10 md:grid-cols-2">
//           <motion.div
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.35, ease: "easeOut" }}
//             className="space-y-5"
//           >
//             <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/70 px-3 py-1 text-xs text-muted-foreground shadow-sm">
//               <span className="h-2 w-2 rounded-full bg-emerald-500" />
//               Production-ready attendance platform
//             </div>
//             <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
//               Smarter attendance dashboard for modern institutions
//             </h1>
//             <p className="max-w-xl text-pretty text-sm text-muted-foreground md:text-base">
//               Manage attendance, leave, shifts and reporting in one elegant
//               workspace designed for administrators, managers and employees.
//             </p>
//             <div className="flex flex-wrap items-center gap-3">
//               <Link
//                 href="/login"
//                 className={buttonVariants({ size: "lg", className: "gap-1.5" })}
//               >
//                 Get started
//                 <ArrowRight className="size-4" />
//               </Link>
//               {isLoggedIn ? (
//                 <Link
//                   href="/dashboard"
//                   className={buttonVariants({ size: "lg", variant: "outline" })}
//                 >
//                   Open dashboard
//                 </Link>
//               ) : null}
//             </div>
//             <div className="text-xs text-muted-foreground">
//               Secure session • Role-based access • Responsive experience
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, scale: 0.98 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
//             className="rounded-3xl border border-border/80 bg-card/70 p-4 shadow-xl shadow-black/5 md:p-6"
//           >
//             <div className="grid gap-3">
//               <div className="rounded-2xl border bg-background/80 p-3">
//                 <div className="text-sm font-medium">Today overview</div>
//                 <div className="mt-2 grid grid-cols-3 gap-2 text-center">
//                   <div className="rounded-xl bg-muted/40 p-2">
//                     <div className="text-xs text-muted-foreground">Present</div>
//                     <div className="text-lg font-semibold">26</div>
//                   </div>
//                   <div className="rounded-xl bg-muted/40 p-2">
//                     <div className="text-xs text-muted-foreground">Late</div>
//                     <div className="text-lg font-semibold">3</div>
//                   </div>
//                   <div className="rounded-xl bg-muted/40 p-2">
//                     <div className="text-xs text-muted-foreground">Leave</div>
//                     <div className="text-lg font-semibold">4</div>
//                   </div>
//                 </div>
//               </div>
//               <div className="rounded-2xl border bg-background/80 p-3 text-sm text-muted-foreground">
//                 “The interface feels clear, focused and easy for daily team
//                 operations.”
//               </div>
//             </div>
//           </motion.div>
//         </section>

//         <section className="mt-12 space-y-4 md:mt-16">
//           <div>
//             <h2 className="text-2xl font-semibold tracking-tight">
//               Everything you need in one place
//             </h2>
//             <p className="text-sm text-muted-foreground">
//               Built for real-world teams with practical workflows.
//             </p>
//           </div>
//           <div className="grid gap-4 sm:grid-cols-2">
//             {features.map((item, idx) => {
//               const Icon = item.icon;
//               return (
//                 <motion.div
//                   key={item.title}
//                   initial={{ opacity: 0, y: 14 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true, amount: 0.5 }}
//                   transition={{ duration: 0.25, delay: idx * 0.04 }}
//                 >
//                   <Card className="h-full border-border/80 bg-card/70">
//                     <CardHeader className="space-y-3">
//                       <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
//                         <Icon className="size-4" />
//                       </div>
//                       <CardTitle className="text-base">{item.title}</CardTitle>
//                     </CardHeader>
//                     <CardContent className="text-sm text-muted-foreground">
//                       {item.description}
//                     </CardContent>
//                   </Card>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }


