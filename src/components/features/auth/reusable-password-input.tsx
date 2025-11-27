"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useFormContext, FieldValues, Path } from "react-hook-form";

interface ReusablePasswordInputProps<T extends FieldValues> {
  name: Path<T>;
  className?: string;
  placeholder?: string;
}

export default function ReusablePasswordInput<T extends FieldValues>({
  name,
  className = "",
  placeholder = "********",
}: ReusablePasswordInputProps<T>) {
  const [show, setShow] = useState(false);
  const { register, formState: { errors } } = useFormContext<T>();
  const error = errors[name];

  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className={`pr-10 ${error && "border-red-500 focus-visible:ring-red-500"} ${className}`}
        id={name as string}
        {...register(name)}
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

