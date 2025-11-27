"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React from "react";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";


interface forgotFormFields {
  email: string;
  
}
export default function ForgotForm() {
  const router = useRouter();
  
  const {register,handleSubmit,getValues } = useForm<forgotFormFields>(
  );
  //  Functions
  const onSubmit: SubmitHandler<forgotFormFields> = async (data) => {
    
    
    //  Forgot Password
    const response =await fetch(`/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = await response.json();
    if (!response.ok) {
      toast.error(payload?.message || "Forgot password failed");
      return;
    }

    // Redirect to verify-OTP page with email in query params
    toast.success("OTP sent successfully!");
    router.push(`/forgot-password/verify-OTP?email=${encodeURIComponent(data.email)}`);
  };

  return (
    <div className=" flex  flex-col gap-8  ">
      <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
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
        
        
      <Button type="submit" onClick={()=> {console.log(getValues())}} className="mt-4 w-full">Send OTP</Button>
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
