"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { signIn } from "@/lib/actions/auth";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    try {
      const result = await signIn(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        router.push("/dashboard");
      }
    } catch {
      // redirect handled by server action
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[rgb(37,99,235)] to-[rgb(16,185,129)] flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">H</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-[rgb(15,23,42)] dark:text-white">Welcome back</h1>
        <p className="text-[rgb(100,116,139)]">Sign in to continue your habit journey</p>
      </div>

      <Card className="shadow-xl border-0 bg-white/80 dark:bg-[rgb(15,23,42)]/80 backdrop-blur-xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              {...register("email")}
              label="Email address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              autoComplete="email"
              autoFocus
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-[rgb(15,23,42)] dark:text-[rgb(241,245,249)]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[rgb(37,99,235)] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="flex h-10 w-full rounded-xl border border-[rgb(226,232,240)] bg-white px-4 py-2 pr-12 text-sm transition-all duration-200 placeholder:text-[rgb(148,163,184)] focus:outline-none focus:ring-2 focus:ring-[rgb(37,99,235)] focus:border-transparent dark:bg-[rgb(15,23,42)] dark:border-[rgb(30,41,59)] dark:text-[rgb(241,245,249)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(100,116,139)] hover:text-[rgb(15,23,42)] dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-[rgb(239,68,68)]">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              <LogIn className="h-4 w-4" />
              Sign in
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-[rgb(15,23,42)] px-3 text-[rgb(100,116,139)]">
                New to HabitFlow?
              </span>
            </div>
          </div>

          <Button asChild variant="outline" className="w-full" size="lg">
            <Link href="/register">Create a free account</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
