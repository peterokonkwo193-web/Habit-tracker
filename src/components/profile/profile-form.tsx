"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { profileSchema, type ProfileInput } from "@/lib/validations/habit";
import { updateProfile } from "@/lib/actions/profile";
import type { Profile } from "@/types";

interface ProfileFormProps {
  profile: Profile | null;
  email: string;
}

export function ProfileForm({ profile, email }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name ?? "",
    },
  });

  const onSubmit = (data: ProfileInput) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => v && formData.append(k, v));
      const result = await updateProfile(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Profile updated!");
      }
    });
  };

  const initials = profile?.full_name?.[0]?.toUpperCase() ?? "U";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-[rgb(37,99,235)]" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[rgb(37,99,235)] to-[rgb(16,185,129)] flex items-center justify-center text-white text-2xl font-bold">
              {initials}
            </div>
            <div>
              <p className="font-medium text-[rgb(15,23,42)] dark:text-white">{email}</p>
              <p className="text-sm text-[rgb(100,116,139)]">Member since {new Date().getFullYear()}</p>
            </div>
          </div>

          <Input
            {...register("full_name")}
            label="Full name"
            placeholder="Your name"
            error={errors.full_name?.message}
          />

          <Button type="submit" loading={isPending}>
            <Save className="h-4 w-4" />
            Save changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
