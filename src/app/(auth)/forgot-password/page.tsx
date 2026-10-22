"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { forgotPassword } from "@/lib/actions/auth";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("email", data.email);
    const result = await forgotPassword(formData);
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="w-full max-w-md text-center space-y-6 animate-fade-in">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[rgba(16,185,129,0.1)] flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-[rgb(16,185,129)]" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[rgb(15,23,42)] dark:text-white">Email sent!</h2>
          <p className="text-[rgb(100,116,139)]">
            Check your inbox for a password reset link. It expires in 60 minutes.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/login">
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-[rgba(37,99,235,0.1)] flex items-center justify-center">
            <Mail className="w-7 h-7 text-[rgb(37,99,235)]" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-[rgb(15,23,42)] dark:text-white">Forgot password?</h1>
        <p className="text-[rgb(100,116,139)]">
          Enter your email and we'll send you a reset link.
        </p>
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
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Send reset link
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-[rgb(100,116,139)] hover:text-[rgb(37,99,235)] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
