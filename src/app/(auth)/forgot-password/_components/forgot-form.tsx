"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { ForgotFormFields } from "@/lib/types/auth";
import FormGlobalError from "@/components/features/auth/form-global-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/lib/schemes/auth.schema";

interface ForgotFormProps {
  onSuccess: (email: string) => void;
}

export default function ForgotForm({ onSuccess }: ForgotFormProps) {
  /* -------------------------------------------------------------------------- */
  /*                                   CONTEXT                                  */
  /* -------------------------------------------------------------------------- */
  const { currentEmail, setCurrentEmail, getCooldown, startCooldown } = useAuth();

  /* -------------------------------------------------------------------------- */
  /*                                    STATE                                   */
  /* -------------------------------------------------------------------------- */
  const [currentCooldown, setCurrentCooldown] = useState(0);

  /* -------------------------------------------------------------------------- */
  /*                              FORM & VALIDATION                             */
  /* -------------------------------------------------------------------------- */
  const { register, handleSubmit, setValue, watch, setError, setFocus, formState: { errors, isSubmitting } } = useForm<ForgotFormFields>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: currentEmail || ""
    }
  });

  /* -------------------------------------------------------------------------- */
  /*                                  VARIABLES                                 */
  /* -------------------------------------------------------------------------- */
  const watchedEmail = watch("email");

  /* -------------------------------------------------------------------------- */
  /*                                  FUNCTIONS                                 */
  /* -------------------------------------------------------------------------- */
  /**
   * Handle form submission
   * @param data - The forgot form data
   */
  const onSubmit: SubmitHandler<ForgotFormFields> = async (data) => {
    if (errors.root?.serverError) {
      setError("root.serverError", { type: "manual", message: "" });
    }

    // Use server action instead of API route
    const { forgotPassword } = await import("@/app/(auth)/actions/auth.actions");

    const result = await forgotPassword(data.email);

    if (!result.success) {
      const message = result.message || "Failed to send OTP";
      const errorData = result.data || {};

      if (errorData.email || message.toLowerCase().includes("email")) {
        setError("root.serverError", {
          message: errorData.email || message
        });
        setFocus("email");
      } else {
        setError("root.serverError", {
          message: message
        });
      }
      return;
    }

    // Update context and start cooldown for this specific email
    setCurrentEmail(data.email);
    startCooldown(data.email);

    toast.success("OTP sent successfully!");
    onSuccess(data.email);
  };

  /* -------------------------------------------------------------------------- */
  /*                                   EFFECTS                                  */
  /* -------------------------------------------------------------------------- */
  /**
   * Pre-fill email if available in context
   */
  useEffect(() => {
    if (currentEmail) {
      setValue("email", currentEmail);
    }
  }, [currentEmail, setValue]);

  /**
   * Update cooldown for the current email being typed
   */
  useEffect(() => {
    const updateCooldown = () => {
      if (watchedEmail) {
        const cooldown = getCooldown(watchedEmail);
        setCurrentCooldown(cooldown);
      } else {
        setCurrentCooldown(0);
      }
    };

    // Initial update
    updateCooldown();

    // Update every second
    const interval = setInterval(updateCooldown, 1000);

    return () => clearInterval(interval);
  }, [watchedEmail, getCooldown]);

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
            type="email"
            className={`w-full mb-3 ${errors.root?.serverError.message?.includes("email") ? "border-red-500 focus-visible:ring-red-500" : ""} ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            placeholder="user@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>
          )}
        </div>
        <FormGlobalError errors={errors} />
        <Button
          type="submit"
          disabled={currentCooldown > 0 || isSubmitting}
          className="mt-4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Spinner size="sm" className="mr-2" /> : (currentCooldown > 0 ? `Resend in ${currentCooldown}s` : "Send OTP")}
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
