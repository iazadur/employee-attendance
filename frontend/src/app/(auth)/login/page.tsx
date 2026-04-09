"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLoginMutation } from "@/store/authApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const next = "/dashboard";
  const [login, loginState] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultValues = useMemo<FormValues>(
    () => ({ email: "", password: "" }),
    [],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    try {
      await login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      }).unwrap();
      toast.success("Welcome back");
      router.replace(next);
    } catch (error) {
      let message = "Invalid email or password";
      if (typeof error === "object" && error !== null && "data" in error) {
        const data = (error as { data?: { message?: unknown } }).data;
        if (Array.isArray(data?.message)) {
          message = data.message.join(", ");
        } else if (typeof data?.message === "string") {
          message = data.message;
        }
      }
      setSubmitError(message);
      toast.error(message);
    }
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="grid min-h-screen w-full lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden overflow-hidden border-r border-border/70 bg-white px-10 py-12 lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1 text-xs text-muted-foreground shadow-sm">
              <ShieldCheck className="size-3.5 text-primary" />
              Employee Attendance System
            </div>
            <div className="space-y-3">
              <h1 className="max-w-xl text-balance text-4xl font-semibold tracking-tight text-foreground">
                Manage attendance with a clean modern workspace
              </h1>
              <p className="max-w-lg text-sm text-muted-foreground">
                Track attendance, leaves, shifts, and reports from a single secure
                dashboard with role-based access.
              </p>
            </div>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Demo credentials</p>
            <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
              <p>
                Admin: <span className="font-mono">azad@gmail.com</span> /
                <span className="font-mono"> Asdf@123</span>
              </p>
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center px-4 py-10 md:px-6">
          <Card className="w-full max-w-md border-border/70 bg-card shadow-xl shadow-black/5">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-semibold tracking-tight">
                Sign in to Employee Attendance
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Continue with your account to access your dashboard.
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="you@company.com"
                            autoComplete="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              autoComplete="current-password"
                              className="pr-16"
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 px-3 text-xs text-muted-foreground hover:text-foreground"
                              onClick={() => setShowPassword((v) => !v)}
                            >
                              {showPassword ? "Hide" : "Show"}
                            </button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Use your account password to continue.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {submitError ? (
                    <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {submitError}
                    </div>
                  ) : null}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginState.isLoading || !form.formState.isValid}
                  >
                    {loginState.isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    By signing in you agree to follow your organisation&apos;s
                    attendance and leave policies.
                  </p>
                  <div className="rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground lg:hidden">
                    Admin demo: <span className="font-mono">azad@gmail.com</span> /
                    <span className="font-mono"> Asdf@123</span>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

