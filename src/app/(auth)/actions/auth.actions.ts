"use server";

/**
 * Server Actions for Authentication
 * These are secure, server-only functions that replace API routes
 */

interface ActionResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

/**
 * Register a new user
 */
export async function registerUser(formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    [key: string]: any;
}): Promise<ActionResponse> {
    try {
        if (!process.env.API) {
            throw new Error("API environment variable is not configured");
        }

        const res = await fetch(`${process.env.API}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const payload = await res.json();

        if (!res.ok) {
            const message = payload?.message || "Registration failed";
            return { success: false, message, status: res.status };
        }

        return { success: true, data: payload, status: 200 };
    } catch (e: any) {
        console.error("Registration error:", e);
        return {
            success: false,
            message: e?.message || "Unexpected error",
            status: 500,
        };
    }
}

/**
 * Request password reset (send OTP to email)
 */
export async function forgotPassword(email: string): Promise<ActionResponse> {
    try {
        if (!process.env.API) {
            throw new Error("API environment variable is not configured");
        }

        const res = await fetch(`${process.env.API}/auth/forgotPassword`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const payload = await res.json();

        if (!res.ok) {
            const message = "Invalid email";
            return { success: false, message, status: res.status };
        }

        return { success: true, data: payload, status: 200 };
    } catch (e: any) {
        console.error("Forgot password error:", e);
        return {
            success: false,
            message: e?.message || "Unexpected error",
            status: 500,
        };
    }
}

/**
 * Verify OTP/reset code
 */
export async function verifyOTP(data: {
    email: string;
    resetCode: string;
}): Promise<ActionResponse> {
    try {
        if (!process.env.API) {
            throw new Error("API environment variable is not configured");
        }

        const res = await fetch(`${process.env.API}/auth/verifyResetCode`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const payload = await res.json();

        if (!res.ok) {
            const message = "Invalid OTP";
            return { success: false, message, status: res.status };
        }

        return { success: true, data: payload, status: 200 };
    } catch (e: any) {
        console.error("Verify OTP error:", e);
        return {
            success: false,
            message: e?.message || "Unexpected error",
            status: 500,
        };
    }
}

/**
 * Reset password with OTP
 */
export async function resetPassword(data: {
    email: string;
    newPassword: string;
}): Promise<ActionResponse> {
    try {
        if (!process.env.API) {
            console.error("API environment variable is not set");
            return {
                success: false,
                message: "Server configuration error. Please contact support.",
                status: 500,
            };
        }

        const res = await fetch(`${process.env.API}/auth/resetPassword`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const payload = await res.json();

        if (!res.ok) {
            const message = payload?.message || "Failed to reset password";
            return { success: false, message, status: res.status };
        }

        return { success: true, data: payload, status: res.status };
    } catch (e: any) {
        console.error("Reset password error:", e);
        return {
            success: false,
            message: e?.message || "Unexpected error occurred. Please try again.",
            status: 500,
        };
    }
}
