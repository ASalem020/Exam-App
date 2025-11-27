"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";

import React from "react";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";

interface loginFormFields {
  email: string;
  password: string;
}
export default function LoginFrom() {
  
  const form = useForm<loginFormFields>(
    {
      defaultValues:{
        email:"",
        password:"",
      }
    }
  );
  //  Functions
  const onSubmit: SubmitHandler<loginFormFields> = async (data) => {
    
    
    //  Login
    const response =await signIn("credentials",{
      email:data.email,
      password:data.password,
      redirect:false,
    })
    if(response?.error){
      toast.error("Invalid credentials");

    }
    if(response?.ok){
      toast.success("Login successful");
    }
  };

  return (
    <div className=" flex  flex-col gap-8  ">
      <h1 className="text-3xl font-bold mb-2">Login</h1>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div>
          <Label htmlFor="email" className="mb-2 block">
            Email
          </Label>
          <Input
            
            id="email"
            className="w-full"
            placeholder="user@example.com"
            {...form.register("email")}
          />  
        </div>
        <div className="flex flex-col">
          <Label htmlFor="password" className="mb-2 block ">
            Password
          </Label>
          <Input
            type="password"
            id="password"
            className="w-full"
            placeholder="*********"
            {...form.register("password")}
          />
          <Link
            href="/forgot-password"
            className="text-end   text-blue-600 hover:underline mt-2"
          >
            Forgot your password?
          </Link>
        </div>
        
      <Button type="submit" onClick={()=>console.log('hh')}  className="mt-4 w-full">Login</Button>
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
