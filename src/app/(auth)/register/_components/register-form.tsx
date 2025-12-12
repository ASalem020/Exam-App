"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import React from "react";
import { toast } from "sonner";
import PhoneField from "./phone-number";
import { signIn } from "next-auth/react";
import { registerSchema } from "@/lib/schemes/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import PasswordInput from "@/components/features/auth/password-input";

export interface registerFormFields {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  rePassword: string;
}
export default function RegisterFrom() {
  const router = useRouter();
  const form = useForm<registerFormFields>({
    resolver: zodResolver(registerSchema),
    mode: "onChange", // Validate on change
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      rePassword: "",
    },
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = form;
  const onSubmit: SubmitHandler<registerFormFields> = async (data) => {
    // Clear previous global error if exists
    if (errors.root?.serverError) {
      setError("root.serverError", { type: "manual", message: "" });
    }

    // Use server action instead of API route
    const { registerUser } = await import("@/app/(auth)/actions/auth.actions");

    const result = await registerUser({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      phone: data.phone,
      password: data.password,
      rePassword: data.rePassword,
    });

    if (!result.success) {
      // Set global error if no field errors exist
      const hasFieldErrors = errors.firstName || errors.lastName || errors.username || 
                            errors.email || errors.phone || errors.password || errors.rePassword;
      if (!hasFieldErrors) {
        setError("root.serverError", {
          type: "manual",
          message: result.message || "Something went wrong"
        });
      }
      toast.error(result.message || "Registration failed");
      return;
    }

    toast.success("Account created successfully.");
    router.push("/login");
  };

  return (
    <div className=" flex  flex-col gap-8  ">
      <h1 className="text-3xl font-bold mb-2">Create Account</h1>
      
      <FormProvider {...form}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            {/*Full Name */}
            <div className="grid grid-cols-2 gap-5">
              {/* First Name */}
              <div>
                <Label htmlFor="first-name" className="mb-2 block">
                  First Name
                </Label>
                <Input
                  type="first-name"
                  id="first-name"
                  className={`w-full
                  ${errors.firstName && "border-red-500 focus-visible:ring-red-500"}
                  `}
                  placeholder="Ahmed"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-red-500">{errors.firstName.message}</p>
                )}
              </div>
              {/* Last Name */}
              <div>
                <Label htmlFor="last-name" className="mb-2 block">
                  Last Name
                </Label>
                <Input
                  type="last-name"
                  id="last-name"
                  className={`w-full
                  ${errors.lastName && "border-red-500 focus-visible:ring-red-500"}
                  `}
                  placeholder="Salem"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            {/* Username */}
            <div>
              <Label htmlFor="username" className="mb-2 block">
                Username
              </Label>
              <Input
                type="username"
                id="username"
                className={`w-full
                ${errors.username && "border-red-500 focus-visible:ring-red-500"}
                `}
                placeholder="user123"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-red-500">{errors.username.message}</p>
              )}
            </div>
            {/* Email */}
            <div>
              <Label htmlFor="email" className="mb-2 block">
                Email
              </Label>
              <Input
                type="email"
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
            {/* Phone Number */}
            <div>
              <PhoneField />
              {errors.phone && (
                <p className="text-red-500">{errors.phone.message}</p>
              )}
            </div>
            {/* Password */}
            <div className="flex flex-col">
              <Label htmlFor="password" className="mb-2 block ">
                Password
              </Label>
              <PasswordInput name="password" />
            </div>
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
            {/* Confirm Password */}
            <div className="flex flex-col">
              <Label htmlFor="rePassword" className="mb-2 block ">
                Confirm password
              </Label>
              <PasswordInput name="rePassword" />
              {errors.rePassword && (
                <p className="text-red-500">{errors.rePassword.message}</p>
              )}
            </div>
          </div>
          {/* Submit Button */}
          {errors.root?.serverError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-600 text-sm">{errors.root.serverError.message}</p>
        </div>
      )}
          <Button type="submit"
            onClick={() => console.log(form.getValues())}
            className="mt-8 w-full">
            Create Account
          </Button>
        </form>
      </FormProvider>
      {/* Login Link */}
      <p className="text-center text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline px-1">
          Login
        </Link>
      </p>
    </div>
  );
}
