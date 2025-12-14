"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schemes/auth.schema";
import { LoginFormFields } from "@/lib/types/auth";

export default function LoginFrom() {
  /* -------------------------------------------------------------------------- */
  /*                                 NAVIGATION                                 */
  /* -------------------------------------------------------------------------- */
  const router = useRouter();

  /* -------------------------------------------------------------------------- */
  /*                              FORM & VALIDATION                             */
  /* -------------------------------------------------------------------------- */
  const form = useForm<LoginFormFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const { register, handleSubmit, setError, formState: { errors } } = form;

  /* -------------------------------------------------------------------------- */
  /*                                  FUNCTIONS                                 */
  /* -------------------------------------------------------------------------- */
  /**
   * Handle form submission
   * @param data - The login form data
   */
  const onSubmit: SubmitHandler<LoginFormFields> = async (data) => {
    //  Login
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false
    })

    if (response?.error) {
      // Set global error if no field errors exist
      const hasFieldErrors = errors.email || errors.password;

      // Note: response.error is usually a string message in credentials provider
      const message = response.error || "";
      let handled = false;
      const fieldKeys: (keyof LoginFormFields)[] = ["email", "password"];

      for (const key of fieldKeys) {
        if (message.toLowerCase().includes(key.toLowerCase())) {
          setError('root.serverError', { type: "manual", message }, { shouldFocus: true });
          handled = true;
          break;
        }
      }

      if (!handled && !hasFieldErrors) {
        setError("root.serverError", {
          type: "manual",
          message: response.error || "Something went wrong"
        });
      }
      toast.error(response.error || "Invalid credentials");
    }

    if (response?.ok) {
      toast.success("Login successful");
      router.push("/diplomas");
    }
  };

  return (
    <div className=" flex  flex-col gap-8  ">
      <h1 className="text-3xl font-bold mb-2">Login</h1>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div>
          <Label htmlFor="email" className="mb-2 block">
            Email
          </Label>
          <Input
            id="email"
            className={`w-full
              ${errors.email && "border-red-500 focus-visible:ring-red-500"}
              `}
            placeholder="user@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <Label htmlFor="password" className="mb-2 block ">
            Password
          </Label>
          <Input
            type="password"
            id="password"
            className={`w-full
              ${errors.password && "border-red-500 focus-visible:ring-red-500"}
              `}
            placeholder="*********"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
          <Link
            href="/forgot-password"
            className="text-end   text-blue-600 hover:underline mt-2"
          >
            Forgot your password?
          </Link>
        </div>
        {errors.root?.serverError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{errors.root.serverError.message}</p>
          </div>
        )}
        <Button type="submit" className="mt-4 w-full">Login</Button>
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
