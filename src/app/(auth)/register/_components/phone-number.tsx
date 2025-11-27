"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } 
  from "@/components/ui/select";
import { registerFormFields } from "./register-form";
import { cn } from "@/lib/utils";

const countries = [
  { code: "EG", flag: "🇪🇬", dial: "+20" },
  { code: "US", flag: "🇺🇸", dial: "+1" },
  { code: "GB", flag: "🇬🇧", dial: "+44" },
  { code: "SA", flag: "🇸🇦", dial: "+966" },
  { code: "AE", flag: "🇦🇪", dial: "+971" },
  { code: "KW", flag: "🇰🇼", dial: "+965" },
  { code: "QA", flag: "🇶🇦", dial: "+974" },
  { code: "FR", flag: "🇫🇷", dial: "+33" },
  { code: "DE", flag: "🇩🇪", dial: "+49" },
  { code: "IT", flag: "🇮🇹", dial: "+39" },
];

export default function PhoneField() {
  const { register, formState: { errors } } = useFormContext<registerFormFields>();
  const [selectedCountryCode, setSelectedCountryCode] = useState("EG"); // Default to Egypt
  
  const selectedCountry = countries.find((c) => c.code === selectedCountryCode) || countries[0];

  return (
    <div className="space-y-2">
      <Label htmlFor="phone" className="text-sm font-medium">
        Phone Number
      </Label>
      
      <div className="flex  items-center">
        {/* Country Dropdown */}
        <Select value={selectedCountryCode} onValueChange={(value) => {
          setSelectedCountryCode(value);
        }}>
          <SelectTrigger className={`w-[90px] rounded-none
          ${errors.phone && "border-red-500 focus-visible:ring-red-500"}
          `}>
            <SelectValue placeholder="Select" />
          </SelectTrigger>

          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.flag} {c.dial}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Phone Input */}
        <Input
          id="phone"
          type="tel"
          placeholder="01234567890"
          className={cn(
            "flex-1",
            errors.phone && "border-red-500 focus-visible:ring-red-500"
          )}
          {...register("phone")}
        />
      </div>
    </div>
  );
}
