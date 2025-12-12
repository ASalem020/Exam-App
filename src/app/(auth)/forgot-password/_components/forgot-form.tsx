"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { useAuth } from "@/context/auth-context";

interface forgotFormFields {
  email: string;
}

interface ForgotFormProps {
  onSuccess: (email: string) => void;
}

export default function ForgotForm({ onSuccess }: ForgotFormProps) {
  const { email, setEmail, cooldown, startCooldown } = useAuth();

  const { register, handleSubmit, setValue, getValues, setError, formState: { errors } } = useForm<forgotFormFields>({
    defaultValues: {
      email: email || ""
    }
  });

  // Pre-fill email if available in context
  useEffect(() => {
    if (email) {
      setValue("email", email);
    }

  }, [email, setValue]);

  //  Functions
  const isEmail = getValues("email") === email;
  const onSubmit: SubmitHandler<forgotFormFields> = async (data) => {
    // Clear previous global error if exists
    if (errors.root?.serverError) {
      setError("root.serverError", { type: "manual", message: "" });
    }

    // Use server action instead of API route
    const { forgotPassword } = await import("@/app/(auth)/actions/auth.actions");

    const result = await forgotPassword(data.email);

    if (!result.success) {
      // Set global error if no field errors exist
      const hasFieldErrors = errors.email;
      if (!hasFieldErrors) {
        setError("root.serverError", {
          type: "manual",
          message: result.message || "Something went wrong"
        });
      }
      toast.error(result.message || "Failed to send OTP");
      return;
    }

    // Update context and call parent callback
    setEmail(data.email);
    startCooldown();

    toast.success("OTP sent successfully!");
    onSuccess(data.email);
  };

  return (
    <div className=" flex  flex-col gap-8  ">
      <div>

      <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>
      <p className="text-muted-foreground">Don't worry, we will help you recover your account.</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div>
          <Label htmlFor="email" className="mb-2 block">
            Email
          </Label>
          <Input
            id="email"
            className="w-full"
            placeholder="user@example.com"
            {...register("email")}
          />
        </div>
{errors.root?.serverError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-600 text-sm">{errors.root.serverError.message}</p>
        </div>
      )}
        <Button
          type="submit"
          disabled={isEmail && cooldown > 0}
          className="mt-4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
         {isEmail && cooldown > 0 ? `Resend in ${cooldown}s` : "Send OTP"}
        </Button>
      </form>

      <p className="text-center text-gray-500">
        Don't have an account?{" "}
        <Link href="/register" className="text-blue-600 hover:underline px-1">
          Create yours
        </Link>
      </p>
    </div>
  );
}
