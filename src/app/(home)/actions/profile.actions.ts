"use server";

import { ProfileSchema } from "@/lib/schemes/auth.schema";

/**
 * Server Actions for Profile Management
 */

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */


/**
 * Update user profile
 */
export async function updateProfile(data: ProfileSchema, token: string) {
    const res = await fetch(`${process.env.API}/auth/editProfile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            token: token
        },
        body: JSON.stringify(data),
    });

    const payload = await res.json();

    if (!res.ok) {
        throw new Error(payload.message || "Failed to update profile");
    }

    return payload;
}

/**
 * Delete user account
 */
export async function deleteAccount(token: string) {
    const res = await fetch(`${process.env.API}/auth/deleteMe`, {
        method: "DELETE",
        headers: {
            token: token
        }
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(error.message || "Failed to delete account");
    }

    const payload = await res.json();
    return payload;
}

/**
 * Change user password
 */
export async function changePassword(
    data: { oldPassword: string; password: string; rePassword: string },
    token: string
) {
    const res = await fetch(`${process.env.API}/auth/changePassword`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            token: token
        },
        body: JSON.stringify(data),
    });

    const payload = await res.json();

    if (!res.ok) {
        throw new Error(payload.message || "Failed to change password");
    }

    return payload;
}
