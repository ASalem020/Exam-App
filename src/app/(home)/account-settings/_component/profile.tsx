"use client";

import PhoneField from "@/app/(auth)/register/_components/phone-number";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileSchema, type ProfileSchema } from "@/lib/schemes/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUpdateProfile, useDeleteAccount } from "@/hooks/use-profile";
import FormGlobalError from "@/components/features/auth/form-global-error";
import { AlertTriangle, X } from "lucide-react";

type ProfileFormFields = ProfileSchema;

export default function Profile() {



  /* -------------------------------------------------------------------------- */
  /*                                   STATES                                   */
  /* -------------------------------------------------------------------------- */

  const [isOpen, setIsOpen] = useState(false)




  /* -------------------------------------------------------------------------- */
  /*                                   CONTEXT                                  */
  /* -------------------------------------------------------------------------- */
  const { data: session } = useSession();

  /* -------------------------------------------------------------------------- */
  /*                                  MUTATIONS                                 */
  /* -------------------------------------------------------------------------- */
  const updateProfileMutation = useUpdateProfile();
  const deleteAccountMutation = useDeleteAccount();

  /* -------------------------------------------------------------------------- */
  /*                              FORM & VALIDATION                             */
  /* -------------------------------------------------------------------------- */
  const profileForm = useForm<ProfileFormFields>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      firstName: session?.user.firstName || "",
      lastName: session?.user.lastName || "",
      username: session?.user.username || "",
      email: session?.user.email || "",
      phone: session?.user.phone || "",
    },
  });

  const {
    setError,
    handleSubmit,
    reset,
    formState: { errors: profileErrors, isDirty, isSubmitting },
  } = profileForm;

  /* -------------------------------------------------------------------------- */
  /*                                  FUNCTIONS                                 */
  /* -------------------------------------------------------------------------- */
  /**
   * Handle profile update submission
   * @param data - The profile form data
   */
  const onProfileSubmit: SubmitHandler<ProfileFormFields> = async (data) => {

    // Check If User No Change Any Data
    if (!isDirty) {
      toast("No Data Changed");
      return;
    }

    try {
      await updateProfileMutation.mutateAsync(data);
    } catch (error: any) {
      const hasFieldErrors = profileErrors.firstName || profileErrors.lastName ||
        profileErrors.username || profileErrors.email || profileErrors.phone;
      if (!hasFieldErrors) {
        setError("root.serverError", {
          message: "Something went wrong",
        });
      }
      if (error.message.includes("findAndModify")) {
        setError("root.serverError", {
          message: "This Email Is Already In Use",
        });
      }
      if (error.message.includes("must be a valid email")) {
        setError("root.serverError", {
          message: "Please enter a valid email",
        });
      }
    }
  };

  /**
   * Handle account deletion
   */
  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  /* -------------------------------------------------------------------------- */
  /*                                   EFFECTS                                  */
  /* -------------------------------------------------------------------------- */
  /**
   * Sync form with session data when it loads or updates
   */
  useEffect(() => {
    if (session?.user) {
      reset({
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        username: session.user.username,
        email: session.user.email,
        phone: session.user.phone,
      });
    }
  }, [session?.user, reset]);

  return (
    <div className="flex flex-col gap-6 bg-white shadow-md p-4 min-h-[70vh]  max-w-4xl w-full">
      <FormProvider {...profileForm}>
        <form onSubmit={handleSubmit(onProfileSubmit)} className="flex flex-col gap-6 justify-between h-full">

          <div className="flex flex-col gap-6">

            {/* First and Last Name */}
            <div className="grid grid-cols-2 gap-6 ">
              <div>
                <Label htmlFor="firstName" className="mb-2 block">
                  First name
                </Label>
                <Input
                  id="firstName"
                  className={`w-full ${profileErrors.firstName && "border-red-500 focus-visible:ring-red-500"
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
                  className={`w-full ${profileErrors.lastName && "border-red-500 focus-visible:ring-red-500"
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
                className={`w-full ${profileErrors.username && "border-red-500 focus-visible:ring-red-500"
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
                className={`w-full ${profileErrors.email && "border-red-500 focus-visible:ring-red-500"
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
              <PhoneField />
              {profileErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{profileErrors.phone.message}</p>
              )}
            </div>
          </div>

          <div>


            {/* Global Error */}
            <FormGlobalError errors={profileErrors} />
            {/* Action Buttons */}
            <div className="flex justify-end items-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setIsOpen(true)}
              >
                Delete My Account
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isSubmitting || updateProfileMutation.isPending}>
                {isSubmitting || updateProfileMutation.isPending ? <Spinner size="sm" className="mr-2" /> : "Save Changes"}
              </Button>
              {isOpen && (
                <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="relative w-full max-w-lg rounded-lg bg-white p-8 shadow-xl">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>

                    <div className="flex flex-col items-center gap-4 text-center">
                      <div className="rounded-full bg-red-50 p-4">
                        <AlertTriangle className="h-10 w-10 text-red-500" />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-red-500">
                          Are you sure you want to delete your account?
                        </h3>
                        <p className="text-gray-500">
                          This action is permanent and cannot be undone.
                        </p>
                      </div>

                      <div className="mt-4 flex w-full gap-3">
                        <Button
                          type="button"
                          variant="secondary"
                          className="flex-1"
                          onClick={() => setIsOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          className="flex-1 bg-red-600 hover:bg-red-700"
                          onClick={handleDeleteAccount}
                          disabled={deleteAccountMutation.isPending}
                        >
                          {deleteAccountMutation.isPending ? <Spinner size="sm" className="mr-2" /> : "Yes, delete"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
