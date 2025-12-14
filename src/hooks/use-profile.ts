"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import { updateProfile, deleteAccount, changePassword } from "@/app/(home)/actions/profile.actions";
import { ProfileSchema } from "@/lib/schemes/auth.schema";

/**
 * Hook for updating user profile
 */
export function useUpdateProfile() {
    const { data: session, update } = useSession();

    return useMutation({
        mutationFn: async (data: ProfileSchema) => {
            if (!session?.accessToken) throw new Error("No access token");
            return updateProfile(data, session.accessToken);
        },
        onSuccess: async (responseData) => {
            // Update session with new user data
            await update({
                user: {
                    ...responseData.user,
                },
            });
            toast.success("Profile updated successfully!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update profile");
        },
    });
}

/**
 * Hook for deleting user account
 */
export function useDeleteAccount() {
    const { data: session } = useSession();

    return useMutation({
        mutationFn: async () => {
            if (!session?.accessToken) throw new Error("No access token");
            return deleteAccount(session.accessToken);
        },
        onSuccess: () => {
            toast.success("Account deleted successfully");
            signOut({ callbackUrl: "/login" });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete account");
        },
    });
}

/**
 * Hook for changing password
 */
export function useChangePassword() {
    const { data: session, update } = useSession();

    return useMutation({
        mutationFn: async (data: { oldPassword: string; password: string; rePassword: string }) => {
            if (!session?.accessToken) throw new Error("No access token");
            return changePassword(data, session.accessToken);
        },
        onSuccess: async (responseData) => {
            // Update session with new token
            await update({
                ...session,
                accessToken: responseData.token || responseData.accessToken
            });
            toast.success("Password changed successfully!");
        },
        onError: (error: Error) => {
            throw error; // Let component handle field-specific errors
        },
    });
}
