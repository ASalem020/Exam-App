"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

import React from "react";
import { toast } from "sonner";
import { resetPasswordSchema, ResetPasswordSchema } from "@/lib/schemes/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import ReusablePasswordInput from "@/components/features/auth/reusable-password-input";

interface CreatePasswordFormFields {
  password: string;
  rePassword: string;
}

export default function CreatePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const form = useForm<CreatePasswordFormFields>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      rePassword: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<CreatePasswordFormFields> = async (data) => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      const response = await fetch(`/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword: data.password,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        toast.error(payload?.message || "Failed to reset password");
        return;
      }

      toast.success("Password reset successfully!");
      router.push("/login");
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(error?.message || "Something went wrong. Please try again.");
    }
  };

  if (!email) {
    return (
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold mb-2">Create New Password</h1>
        <p className="text-red-500">Email is required. Please go back to forgot password page.</p>
        <Link href="/forgot-password" className="text-blue-600 hover:underline">
          Go back
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold mb-2">Create New Password</h1>
        <p className="text-muted-foreground text-sm">
          Your new password must be different from previously used passwords.
        </p>
      </div>

      <FormProvider {...form}>
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          {/* Password */}
          <div className="flex flex-col">
            <Label htmlFor="password" className="mb-2 block">
              Password
            </Label>
            <ReusablePasswordInput<CreatePasswordFormFields>
              name="password"
              placeholder="Enter your new password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col">
            <Label htmlFor="rePassword" className="mb-2 block">
              Confirm Password
            </Label>
            <ReusablePasswordInput<CreatePasswordFormFields>
              name="rePassword"
              placeholder="Confirm your new password"
            />
            {errors.rePassword && (
              <p className="text-red-500 text-sm mt-1">{errors.rePassword.message as string}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className={cn(
              "mt-4 w-full",
              (errors.password || errors.rePassword) && "mt-6"
            )}
          >
            Reset Password
          </Button>
        </form>
      </FormProvider>

      <p className="text-center text-gray-500">
        Remember your password?{" "}
        <Link href="/login" className="text-blue-600 hover:underline px-1">
          Login
        </Link>
      </p>
    </div>
  );
}

