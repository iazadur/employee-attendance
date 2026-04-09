"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLoginMutation } from "@/store/authApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const next = "/dashboard";
  const [login, loginState] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

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
    try {
      await login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      }).unwrap();
      toast.success("Welcome back");
      router.replace(next);
    } catch {
      toast.error("Invalid email or password");
    }
  }

  return (
    <div className="min-h-[calc(100vh-1px)] w-full bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10 md:px-6 md:py-12">
        <div className="grid w-full items-center gap-10 md:grid-cols-2">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/70 px-3 py-1 text-xs text-muted-foreground shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Production-ready attendance dashboard</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                Sign in to continue
              </h1>
              <p className="text-pretty text-sm text-muted-foreground md:text-base">
                Use your company account to manage attendance, leave, shifts and
                reports in one place.
              </p>
            </div>
            <div className="hidden text-xs text-muted-foreground md:block">
              <p className="font-medium text-foreground">Demo credentials</p>
              <p>
                Admin: <span className="font-mono">azad@gmail.com</span> /
                <span className="font-mono"> Asdf@123</span>
              </p>
            </div>
          </div>

          <Card className="w-full border-border/80 bg-card/80 shadow-lg shadow-black/5">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Login to Employee Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="space-y-2 text-sm">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email?.message ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2 text-sm">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="pr-16"
                      {...form.register("password")}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {form.formState.errors.password?.message ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.password.message}
                    </p>
                  ) : null}
                </div>

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
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

