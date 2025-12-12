"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { resetPasswordSchema } from "@/lib/schemes/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import ReusablePasswordInput from "@/components/features/auth/reusable-password-input";

interface CreatePasswordFormFields {
  password: string;
  rePassword: string;
}

interface CreatePasswordFormProps {
  email: string;
}

export default function CreatePasswordForm({ email }: CreatePasswordFormProps) {
  const router = useRouter();

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
    setError,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<CreatePasswordFormFields> = async (data) => {
    // Clear previous global error if exists
    if (errors.root?.serverError) {
      setError("root.serverError", { type: "manual", message: "" });
    }

    try {
      // Use server action instead of API route
      const { resetPassword } = await import("@/app/(auth)/actions/auth.actions");

      const result = await resetPassword({
        email,
        newPassword: data.password,
      });

      if (!result.success) {
        // Set global error if no field errors exist
        const hasFieldErrors = errors.password || errors.rePassword;
        if (!hasFieldErrors) {
          setError("root.serverError", {
            type: "manual",
            message: result.message || "Something went wrong"
          });
        }
        toast.error(result.message || "Failed to reset password");
        return;
      }

      toast.success("Password reset successfully!");
      router.push("/login");
    } 
    catch (error: any) {
      // Set global error if no field errors exist
      const hasFieldErrors = errors.password || errors.rePassword;
      if (!hasFieldErrors) {
        setError("root.serverError", {
          type: "manual",
          message: error?.message || "Something went wrong"
        });
      }
      toast.error(error?.message || "Something went wrong. Please try again.");
    }
  };

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
          {errors.root?.serverError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-600 text-center text-sm">{errors.root.serverError.message}</p>
        </div>
      )}
          <Button
            type="submit"
            className='mt-4 w-full' 
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

