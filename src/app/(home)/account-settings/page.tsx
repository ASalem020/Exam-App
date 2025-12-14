"use client";

import React, { useState } from "react";
import HomeHeader from "@/components/layout/home-header";
import { User, Lock } from "lucide-react";

import Profile from "./_component/profile";
import Password from "./_component/password";

const breadcrumbs = [
  { label: "Home", href: "/diplomas" },
  { label: "Account" }
];


export default function AccountSettingPage() {

  /* -------------------------------------------------------------------------- */
  /*                                    STATE                                   */
  /* -------------------------------------------------------------------------- */
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");


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
          className={`pb-3 px-2 font-medium transition-colors ${activeTab === "profile"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-600 hover:text-gray-800"
            }`}
        >
          <User className="w-4 h-4" /> Profile
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`pb-3 px-2 font-medium transition-colors ${activeTab === "password"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-600 hover:text-gray-800"
            }`}
        >
          <Lock className="w-4 h-4" /> Change Password
        </button>
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
  );
}
