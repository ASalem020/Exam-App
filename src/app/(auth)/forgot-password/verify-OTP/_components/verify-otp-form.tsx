"use client";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

const RESEND_TIMER_DURATION = 60; // 60 seconds
const STORAGE_KEY_PREFIX = "otp_resend_timer_";

export default function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);


  // Get storage key for this email
  const getStorageKey = useCallback(() => {
    return `${STORAGE_KEY_PREFIX}${email}`;
  }, [email]);

  // Initialize timer from localStorage or start new one
  useEffect(() => {
    if (!email || typeof window === "undefined") return;

    const storageKey = getStorageKey();
    const storedEndTime = localStorage.getItem(storageKey);

    if (storedEndTime) {
      // Check if timer is still valid
      const endTime = parseInt(storedEndTime, 10);
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));

      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        // Timer expired, clean up
        localStorage.removeItem(storageKey);
        setTimeLeft(0);
      }
    } else {
      // No existing timer, start new one
      const endTime = Date.now() + RESEND_TIMER_DURATION * 1000;
      localStorage.setItem(storageKey, endTime.toString());
      setTimeLeft(RESEND_TIMER_DURATION);
    }
  }, [email, getStorageKey]);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0 || typeof window === "undefined") return;

    const interval = setInterval(() => {
      const storageKey = getStorageKey();
      const storedEndTime = localStorage.getItem(storageKey);

      if (storedEndTime) {
        const endTime = parseInt(storedEndTime, 10);
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));

        if (remaining > 0) {
          setTimeLeft(remaining);
        } else {
          localStorage.removeItem(storageKey);
          setTimeLeft(0);
        }
      } else {
        setTimeLeft(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, getStorageKey]);

  // Start or restart timer
  const startTimer = useCallback(() => {
    if (!email || typeof window === "undefined") return;
    
    const storageKey = getStorageKey();
    const endTime = Date.now() + RESEND_TIMER_DURATION * 1000;
    localStorage.setItem(storageKey, endTime.toString());
    setTimeLeft(RESEND_TIMER_DURATION);
  }, [email, getStorageKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    
    try {
      // Verify OTP API call
      const response = await fetch(`/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetCode: otp }),
      });
      
      const payload = await response.json();
      
      if (!response.ok) {
        toast.error(payload?.message || "Invalid OTP");
        return;
      }

      toast.success("OTP verified successfully!");
      // Clean up timer from localStorage
      if (typeof window !== "undefined") {
        const storageKey = getStorageKey();
        localStorage.removeItem(storageKey);
      }
      // Redirect to create password page with email
      router.push(`/create-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (timeLeft > 0) {
      toast.error(`Please wait ${timeLeft} second${timeLeft > 1 ? 's' : ''} before resending`);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const payload = await response.json();
      
      if (!response.ok) {
        toast.error(payload?.message || "Failed to resend OTP");
        return;
      }

      toast.success("OTP resent successfully!");
      // Reset timer to 60 seconds
      startTimer();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold mb-2">Verify OTP</h1>
        <p className="text-red-500">Email is required. Please go back to forgot password page.</p>
        <Link href="/forgot-password" className="text-blue-600 hover:underline">
          Go back
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold mb-2">Verify OTP</h1>
        <p className="text-muted-foreground text-sm">
          We've sent a verification code to <span className="font-medium">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="otp" className="text-sm font-medium">
            Enter Verification Code
          </Label>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} className="w-10 h-10 !rounded-none" />
                <InputOTPSlot index={1} className="w-10 h-10 !rounded-none" />
                <InputOTPSlot index={2} className="w-10 h-10 !rounded-none" />
                <InputOTPSlot index={3} className="w-10 h-10 !rounded-none" />
                <InputOTPSlot index={4} className="w-10 h-10 !rounded-none" />
                <InputOTPSlot index={5} className="w-10 h-10 !rounded-none" />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Button type="submit" disabled={isLoading || otp.length !== 6} className="w-full">
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              {timeLeft > 0 ? (
                <span className="text-blue-600 font-medium">
                  Resend in {timeLeft}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isLoading || timeLeft > 0}
                  className="text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Resend
                </button>
              )}
            </p>
          </div>
        </div>
      </form>

      <p className="text-center text-gray-500">
        Wrong email?{" "}
        <Link href="/forgot-password" className="text-blue-600 hover:underline px-1">
          Go back
        </Link>
      </p>
    </div>
  );
}

