"use client";

import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GraduationCap, LogOut, MoreVertical, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {

  /* -------------------------------------------------------------------------- */
  /*                                   NAVIGATION                               */
  /* -------------------------------------------------------------------------- */
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  /* -------------------------------------------------------------------------- */
  /*                                   FUNCTIONS                                */
  /* -------------------------------------------------------------------------- */
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!session?.user) return "U";
    const firstName = session.user.firstName || "";
    const lastName = session.user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  };


  // Check if diplomas is active (includes /diplomas and /diplomas/[id] but not /account-settings)
  const isDiplomasActive = pathname === "/diplomas" || (pathname.startsWith("/diplomas/"));
  const isAccountSettingsActive = pathname === "/account-settings";

  return (
    <div className="flex h-screen ">
      {/* Left Side - Sidebar */}
      <aside className="w-64 p-5 h-screen bg-blue-50 justify-between items-center flex flex-col">
        <div className="flex flex-col gap-16 w-full h-full">
          {/* Logo */}
          <div className="flex items-start flex-col gap-3">
            <Image src="/assets/images/Final Logo 1.png" width={200} height={200} alt="logo" />
            <div className="rounded-lg flex items-center justify-center">
              <img src="/assets/icons/folder-code.svg" alt="folder-code-icon" />
              <span className="text-blue-600 text-xl font-bold">Exam App</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-2">
            <Link
              href="/diplomas"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isDiplomasActive
                  ? "bg-blue-600 text-white font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <GraduationCap className={isDiplomasActive ? "text-white" : "text-gray-500"} />
              Diplomas
            </Link>
            <Link
              href="/account-settings"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isAccountSettingsActive
                  ? "bg-blue-600 text-white font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <User className={isAccountSettingsActive ? "text-white" : "text-gray-500"} />
              Account Settings
            </Link>
          </div>

          {/* Spacer to push user profile to bottom */}
          <div className="flex-1" />

          {/* User Profile Dropdown */}
          <div className="w-full">
            {status === "loading" ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                </div>
              </div>
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition-colors w-full text-left">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={session.user.image || undefined} />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {session.user.firstName} {session.user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/account-settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      </aside>

      {/* Right Side - Main Content */}
      <main className="w-full h-screen overflow-y-scroll py-2 px-4">
        {children}
      </main>
    </div>
  );
}
