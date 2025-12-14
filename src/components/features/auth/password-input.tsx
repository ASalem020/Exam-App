"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { RegisterFormFields } from "@/lib/types/auth";


export default function PasswordInput({name, className}: {name: keyof RegisterFormFields, className?: string}) {
  const [show, setShow] = useState(false);
  const {register, formState: {errors}} =useFormContext<RegisterFormFields>();

  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        placeholder='********'
        className={`pr-10 ${errors[name] && "border-red-500 focus-visible:ring-red-500"} ${className}`}
        id={name}
        {...register(name)}

      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
