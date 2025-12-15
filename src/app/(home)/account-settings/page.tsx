"use client";

import React, { useState } from "react";
import HomeHeader from "@/components/layout/home-header";
import { User, Lock, LogOut } from "lucide-react";
import Profile from "./_component/profile";
import Password from "./_component/password";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const breadcrumbs = [
  { label: "Home", href: "/diplomas" },
  { label: "Account" }
];


export default function AccountSettingPage() {

  /* -------------------------------------------------------------------------- */
  /*                                NAVIGATION                                  */
  /* -------------------------------------------------------------------------- */
  const router = useRouter();

  /* -------------------------------------------------------------------------- */
  /*                                    STATE                                   */
  /* -------------------------------------------------------------------------- */
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

   const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
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
      <div className="flex gap-6  ">

      <div className="flex flex-col justify-between bg-white shadow-md p-4 gap-6 me-6 border-b">
        <div className="flex flex-col gap-6">

        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 px-2 flex items-center gap-2 font-medium transition-colors ${activeTab === "profile"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-600 hover:text-gray-800"
            }`}
        >
          <User className="w-4 h-4" /> Profile
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`pb-3 px-2 flex items-center gap-2 font-medium transition-colors ${activeTab === "password"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-600 hover:text-gray-800"
            }`}
        >
          <Lock className="w-4 h-4" /> Change Password
        </button>
        </div>

        {/* logout */}
        <div>

        <Button variant="outline" onClick={handleLogout} className="text-red-600 bg-red-50 hover:text-red-600">
                    <LogOut className="mr-2 h-4 w-4 rotate-180" />
                    <span>Logout</span>
                  </Button>
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" &&
        (
          <Profile />
        )}

      {/* Change Password Tab */}
      {activeTab === "password" && (
        <Password />
      )}
      </div>
    </div>
  );
}
