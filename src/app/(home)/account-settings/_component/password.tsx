"use client";

import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ReusablePasswordInput from "@/components/features/auth/reusable-password-input";
import { changePasswordSchema, type ChangePasswordSchema } from "@/lib/schemes/auth.schema";
import { useChangePassword } from "@/hooks/use-profile";
import FormGlobalError from "@/components/features/auth/form-global-error";

type ChangePasswordFormFields = ChangePasswordSchema;

export default function Password() {
    /* -------------------------------------------------------------------------- */
    /*                                  MUTATIONS                                 */
    /* -------------------------------------------------------------------------- */
    const changePasswordMutation = useChangePassword();

    /* -------------------------------------------------------------------------- */
    /*                              FORM & VALIDATION                             */
    /* -------------------------------------------------------------------------- */
    // Change password form
    const passwordForm = useForm<ChangePasswordFormFields>({
        resolver: zodResolver(changePasswordSchema),
        mode: "onChange",
        defaultValues: {
            oldPassword: "",
            password: "",
            rePassword: "",
        },
    });

    const { setError: setPasswordError, setFocus, formState: { errors: passwordErrors } } = passwordForm;

    /* -------------------------------------------------------------------------- */
    /*                                  FUNCTIONS                                 */
    /* -------------------------------------------------------------------------- */
    /**
     * Handle password change submission
     * @param data - The password change form data
     */
    const onPasswordSubmit: SubmitHandler<ChangePasswordFormFields> = async (data) => {
        try {
            await changePasswordMutation.mutateAsync(data);
            passwordForm.reset();
        } catch (error: any) {
            const message = error?.message

            // Map specific errors to fields
            if (message.toLowerCase().includes("oldpassword") || message.toLowerCase().includes("incorrect")) {
                setPasswordError("root.serverError", { message: "The Current Password Is Incorrect" });
                setFocus("oldPassword");
            } else {
                setPasswordError("root.serverError", {
                    message: "Server Error Check Your Connection"
                });
            }
        }
    };

    return (
        <div className="flex flex-col gap-6  bg-white shadow-md p-4 min-h-[70vh] max-w-4xl w-full">
            <FormProvider {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="flex flex-col gap-6 justify-between h-full">

                    <div className="flex flex-col gap-6">

                        {/* Current Password */}
                        <div >
                            <Label htmlFor="oldPassword" className="mb-2 block">
                                Current Password
                            </Label>
                            <Input
                                id="oldPassword"
                                type="password"
                                placeholder="•••••••••"
                                className={`w-full ${passwordErrors.oldPassword && "border-red-500 focus-visible:ring-red-500"
                                    }`}
                                {...passwordForm.register("oldPassword")}
                            />
                            {passwordErrors.oldPassword && (
                                <p className="text-red-500 text-sm mt-1">{passwordErrors.oldPassword.message}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div>
                            <Label htmlFor="password" className="mb-2 block">
                                New Password
                            </Label>
                            <ReusablePasswordInput<ChangePasswordFormFields>
                                name="password"
                                placeholder="Enter your new password"
                            />
                            {passwordErrors.password && (
                                <p className="text-red-500 text-sm mt-1">{passwordErrors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <Label htmlFor="rePassword" className="mb-2 block">
                                Confirm New Password
                            </Label>
                            <ReusablePasswordInput<ChangePasswordFormFields>
                                name="rePassword"
                                placeholder="Confirm your new password"
                            />
                            {passwordErrors.rePassword && (
                                <p className="text-red-500 text-sm mt-1">{passwordErrors.rePassword.message}</p>
                            )}
                        </div>
                    </div>
                    <div>


                        {/* Global Error */}
                        <FormGlobalError errors={passwordErrors} />
                        {/* Submit Button */}
                        <Button type="submit" className="mt-4 w-full  bg-blue-600 hover:bg-blue-700">
                            Update Password
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
