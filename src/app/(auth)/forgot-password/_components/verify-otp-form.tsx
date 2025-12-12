"use client";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@radix-ui/react-label";
import React from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

interface VerifyOTPFormFields {
  otp: string;
}

interface VerifyOTPFormProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
  onEdit: () => void;
}

export default function VerifyOTPForm({ email, onSuccess, onBack, onEdit }: VerifyOTPFormProps) {
  const { setEmail, cooldown, startCooldown } = useAuth();

  const { control, handleSubmit, formState: { isValid, errors }, setError } = useForm<VerifyOTPFormFields>({
    defaultValues: {
      otp: ""
    },
    mode: "onChange"
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: { email: string; resetCode: string }) => {
      const { verifyOTP } = await import("@/app/(auth)/actions/auth.actions");
      const result = await verifyOTP(data);
      if (!result.success) {
        throw new Error(result.message || "Invalid OTP");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("OTP verified successfully!");
      onSuccess();
    },
    onError: (error: Error) => {
      // Set global error if no field errors exist
      const hasFieldErrors = errors.otp;
      if (!hasFieldErrors) {
        setError("root.serverError", {
          type: "manual",
          message: error.message || "Something went wrong"
        });
      }
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  });

  const resendMutation = useMutation({
    mutationFn: async (email: string) => {
      const { forgotPassword } = await import("@/app/(auth)/actions/auth.actions");
      const result = await forgotPassword(email);
      if (!result.success) {
        throw new Error(result.message || "Failed to resend OTP");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("OTP resent successfully!");
      startCooldown();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to resend OTP");
    }
  });

  const onSubmit: SubmitHandler<VerifyOTPFormFields> = (data) => {
    if (data.otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    verifyMutation.mutate({ email, resetCode: data.otp });
  };

  const handleResendOTP = () => {
    if (cooldown > 0) return;
    resendMutation.mutate(email);
  };

  const isLoading = verifyMutation.isPending || resendMutation.isPending;

  return (
    email ? (
      <div className="flex flex-col gap-8">
        <button
          type="button"
          className="w-fit border-2 border-gray-300/20 p-1"
          onClick={onBack}
        >
          <ArrowLeft className="w-6 h-6 " />
        </button>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold mb-2">Verify OTP</h1>
          <p className="text-muted-foreground text-sm">
            Please enter the 6-digits code we have sent to: <br /><span className="font-medium">{email}.  <button type="button" onClick={onEdit} className="text-blue-600 hover:underline px-1">
              Edit
            </button></span>
          </p>

        </div>
        

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="otp" className="text-sm font-medium">
              Enter Verification Code
            </Label>
            <div className="flex justify-center">
              <Controller
                name="otp"
                control={control}
                rules={{ required: true, minLength: 6, maxLength: 6 }}
                render={({ field }) => (
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {errors.root?.serverError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{errors.root.serverError.message}</p>
          </div>
        )}
            <Button type="submit" disabled={isLoading || !isValid} className="w-full">
              {verifyMutation.isPending ? "Verifying..." : "Verify OTP"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?{" "}
                {cooldown > 0 ? (
                  <span className="text-blue-600 font-medium">
                    Resend in {cooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading || cooldown > 0}
                    className="text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendMutation.isPending ? "Resending..." : "Resend"}
                  </button>
                )}
              </p>
            </div>
          </div>
        </form>


      </div>
    ) : (
      <div>
        <p>Something went wrong</p>
        <button onClick={onBack}>Go back</button>
      </div>
    )
  );
}
