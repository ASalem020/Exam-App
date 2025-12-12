"use client";

import React, { useState, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ReusablePasswordInput from "@/components/features/auth/reusable-password-input";
import { User, Lock } from "lucide-react";
import PhoneField from "@/app/(auth)/register/_components/phone-number";
import HomeHeader from "@/components/layout/home-header";
import { useSession } from "next-auth/react";
import { profileSchema, changePasswordSchema, type ProfileSchema, type ChangePasswordSchema } from "@/lib/schemes/auth.schema";

type ProfileFormFields = ProfileSchema;
type ChangePasswordFormFields = ChangePasswordSchema;

const breadcrumbs = [
  { label: "Home", href: "/diplomas" },
  { label: "Account" }
];

export default function AccountSettingPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [userData, setUserData] = useState<ProfileFormFields | null>(null);

  // Profile form
  const profileForm = useForm<ProfileFormFields>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
    },
  });

  // Update form values when session is loaded
  useEffect(() => {
    if (session?.user) {
      profileForm.reset({
        firstName: session.user.firstName || "",
        lastName: session.user.lastName || "",
        username: session.user.username || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
      });
    }
  }, [session, profileForm]);

  const { setError: setProfileError, formState: { errors: profileErrors } } = profileForm;

  // Change password form
  const passwordForm = useForm<ChangePasswordFormFields>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      password: "",
      rePassword: "",
    },
  });

  const { setError: setPasswordError, formState: { errors: passwordErrors } } = passwordForm;

  // Profile submit handler
  const onProfileSubmit: SubmitHandler<ProfileFormFields> = async (data) => {
    // Clear previous global error if exists
    if (profileErrors.root?.serverError) {
      setProfileError("root.serverError", { type: "manual", message: "" });
    }

    try {
      // TODO: Replace with actual API call or server action
      // For now, just show success
      setUserData(data);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      const hasFieldErrors = profileErrors.firstName || profileErrors.lastName || 
                            profileErrors.username || profileErrors.email || profileErrors.phone;
      if (!hasFieldErrors) {
        setProfileError("root.serverError", {
          type: "manual",
          message: error?.message || "Something went wrong",
        });
      }
      toast.error(error?.message || "Failed to update profile");
    }
  };

  // Change password submit handler
  const onPasswordSubmit: SubmitHandler<ChangePasswordFormFields> = async (data) => {
    // Clear previous global error if exists
    if (passwordErrors.root?.serverError) {
      setPasswordError("root.serverError", { type: "manual", message: "" });
    }

    try {
      // TODO: Replace with actual API call or server action
      // For now, just show success
      toast.success("Password changed successfully!");
      passwordForm.reset();
    } catch (error: any) {
      const hasFieldErrors = passwordErrors.currentPassword || passwordErrors.password || passwordErrors.rePassword;
      if (!hasFieldErrors) {
        setPasswordError("root.serverError", {
          type: "manual",
          message: error?.message || "Something went wrong",
        });
      }
      toast.error(error?.message || "Failed to change password");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Breadcrumb */}
      <HomeHeader 
        text="Account Settings" 
        icon={<User className='text-white' />} 
        back={false} 
        breadcrumbs={breadcrumbs}
      />

      {/* Tabs */}
      <div className="flex gap-6 border-b">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 px-2 font-medium transition-colors ${
            activeTab === "profile"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <User className="w-4 h-4" /> Profile
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`pb-3 px-2 font-medium transition-colors ${
            activeTab === "password"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <Lock className="w-4 h-4" /> Change Password
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="flex flex-col gap-6">
          <FormProvider {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="flex flex-col gap-6">
              {/* Global Error */}
              {profileErrors.root?.serverError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm">{profileErrors.root.serverError.message}</p>
                </div>
              )}

              {/* First and Last Name */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="mb-2 block">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    className={`w-full ${
                      profileErrors.firstName && "border-red-500 focus-visible:ring-red-500"
                    }`}
                    placeholder="Ahmed"
                    {...profileForm.register("firstName")}
                  />
                  {profileErrors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{profileErrors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName" className="mb-2 block">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    className={`w-full ${
                      profileErrors.lastName && "border-red-500 focus-visible:ring-red-500"
                    }`}
                    placeholder="Abdullah"
                    {...profileForm.register("lastName")}
                  />
                  {profileErrors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{profileErrors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Username */}
              <div>
                <Label htmlFor="username" className="mb-2 block">
                  Username
                </Label>
                <Input
                  id="username"
                  className={`w-full ${
                    profileErrors.username && "border-red-500 focus-visible:ring-red-500"
                  }`}
                  placeholder="user123"
                  {...profileForm.register("username")}
                />
                {profileErrors.username && (
                  <p className="text-red-500 text-sm mt-1">{profileErrors.username.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="mb-2 block">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className={`w-full ${
                    profileErrors.email && "border-red-500 focus-visible:ring-red-500"
                  }`}
                  placeholder="user@example.com"
                  {...profileForm.register("email")}
                />
                {profileErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{profileErrors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="mb-2 block">
                  Phone
                </Label>
                <PhoneField />
                {profileErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{profileErrors.phone.message}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  Delete My Account
                </Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      )}

      {/* Change Password Tab */}
      {activeTab === "password" && (
        <div className="flex flex-col gap-6">
          <FormProvider {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="flex flex-col gap-6">
              {/* Global Error */}
              {passwordErrors.root?.serverError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm">{passwordErrors.root.serverError.message}</p>
                </div>
              )}

              {/* Current Password */}
              <div>
                <Label htmlFor="currentPassword" className="mb-2 block">
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="•••••••••"
                  className={`w-full ${
                    passwordErrors.currentPassword && "border-red-500 focus-visible:ring-red-500"
                  }`}
                  {...passwordForm.register("currentPassword")}
                />
                {passwordErrors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword.message}</p>
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

              {/* Submit Button */}
              <Button type="submit" className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
                Update Password
              </Button>
            </form>
          </FormProvider>
        </div>
      )}
    </div>
  );
}
