"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserPlus, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signUp } from "@/lib/actions/auth";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));

    const result = await signUp(formData);
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md text-center space-y-6 animate-fade-in">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[rgba(16,185,129,0.1)] flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-[rgb(16,185,129)]" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[rgb(15,23,42)] dark:text-white">Check your email</h2>
          <p className="text-[rgb(100,116,139)]">
            We sent you a verification link. Click it to activate your account and start tracking habits.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/login">Back to login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[rgb(37,99,235)] to-[rgb(16,185,129)] flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">H</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-[rgb(15,23,42)] dark:text-white">Create account</h1>
        <p className="text-[rgb(100,116,139)]">Start building better habits today. Free forever.</p>
      </div>

      <Card className="shadow-xl border-0 bg-white/80 dark:bg-[rgb(15,23,42)]/80 backdrop-blur-xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register("full_name")}
              label="Full name"
              placeholder="Alex Johnson"
              error={errors.full_name?.message}
              autoComplete="name"
              autoFocus
            />
            <Input
              {...register("email")}
              label="Email address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              autoComplete="email"
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[rgb(15,23,42)] dark:text-[rgb(241,245,249)]">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 chars, uppercase, number"
                  autoComplete="new-password"
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
            <Input
              {...register("confirm_password")}
              label="Confirm password"
              type="password"
              placeholder="Repeat your password"
              error={errors.confirm_password?.message}
              autoComplete="new-password"
            />

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              <UserPlus className="h-4 w-4" />
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[rgb(100,116,139)]">
            Already have an account?{" "}
            <Link href="/login" className="text-[rgb(37,99,235)] hover:underline font-medium">
              Sign in
            </Link>
          </p>

          <p className="mt-3 text-center text-xs text-[rgb(148,163,184)]">
            By creating an account you agree to our{" "}
            <a href="#" className="underline">Terms of Service</a> and{" "}
            <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
