"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { resetPassword } from "@/lib/actions/auth";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("password", data.password);
    formData.append("confirm_password", data.confirm_password);
    const result = await resetPassword(formData);
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Password updated successfully!");
      router.push("/login");
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-[rgba(37,99,235,0.1)] flex items-center justify-center">
            <KeyRound className="w-7 h-7 text-[rgb(37,99,235)]" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-[rgb(15,23,42)] dark:text-white">New password</h1>
        <p className="text-[rgb(100,116,139)]">Choose a strong password for your account.</p>
      </div>

      <Card className="shadow-xl border-0 bg-white/80 dark:bg-[rgb(15,23,42)]/80 backdrop-blur-xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              {...register("password")}
              label="New password"
              type="password"
              placeholder="Min 8 chars, uppercase, number"
              error={errors.password?.message}
              autoComplete="new-password"
            />
            <Input
              {...register("confirm_password")}
              label="Confirm password"
              type="password"
              placeholder="Repeat your password"
              error={errors.confirm_password?.message}
              autoComplete="new-password"
            />
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
