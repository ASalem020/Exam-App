"use server";

import { RegisterFormFields } from "@/lib/types/auth";
import { ActionResponse } from "@/lib/types/api";

/**
 * Server Actions for Authentication
 * These are secure, server-only functions that replace API routes
 */

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Register a new user
 * @param formData - The registration form data
 * @returns {Promise<ActionResponse>} The response from the registration API
 */
export async function registerUser(formData: RegisterFormFields): Promise<ActionResponse> {
    try {
        const res = await fetch(`${process.env.API}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const payload = await res.json();

        if (!res.ok) {
            return {
                success: false,
                data: payload,
                message: payload.message || "Registration failed"
            };
        }

        return {
            success: true,
            data: payload,
            message: payload.message || "Registration successful"
        };
    } catch (error) {
        console.error("Register error:", error);
        return {
            success: false,
            message: "Network error. Please try again."
        };
    }
}

/**
 * Request password reset (send OTP to email)
 * @param email - The email address to send OTP to
 * @returns {Promise<ActionResponse>} The response from the forgot password API
 */
export async function forgotPassword(email: string): Promise<ActionResponse> {
    try {
        const res = await fetch(`${process.env.API}/auth/forgotPassword`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const payload = await res.json();

        if (!res.ok) {
            return {
                success: false,
                data: payload,
                message: payload.message || "Failed to send OTP"
            };
        }

        return {
            success: true,
            data: payload,
            message: payload.message || "OTP sent successfully"
        };
    } catch (error) {
        console.error("Forgot password error:", error);
        return {
            success: false,
            message: "Network error. Please try again."
        };
    }
}

/**
 * Verify OTP/reset code
 * @param data - The email and reset code
 * @returns {Promise<ActionResponse>} The response from the verify OTP API
 */
export async function verifyOTP(data: {
    email: string;
    resetCode: string;
}): Promise<ActionResponse> {
    try {
        const res = await fetch(`${process.env.API}/auth/verifyResetCode`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const payload = await res.json();

        if (!res.ok) {
            return {
                success: false,
                data: payload,
                message: payload.message || "Invalid OTP"
            };
        }

        return {
            success: true,
            data: payload,
            message: payload.message || "OTP verified successfully"
        };
    } catch (error) {
        console.error("Verify OTP error:", error);
        return {
            success: false,
            message: "Network error. Please try again."
        };
    }
}

/**
 * Reset password with OTP
 * @param data - The email and new password
 * @returns {Promise<ActionResponse>} The response from the reset password API
 */
export async function resetPassword(data: {
    email: string;
    newPassword: string;
}): Promise<ActionResponse> {
    try {
        const res = await fetch(`${process.env.API}/auth/resetPassword`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const payload = await res.json();

        if (!res.ok) {
            return {
                success: false,
                data: payload,
                message: payload.message || "Failed to reset password"
            };
        }

        return {
            success: true,
            data: payload,
            message: payload.message || "Password reset successfully"
        };
    } catch (error) {
        console.error("Reset password error:", error);
        return {
            success: false,
            message: "Network error. Please try again."
        };
    }
}
