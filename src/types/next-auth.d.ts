import { DefaultSession } from "next-auth";
import { LoginResponse } from "@/lib/types/auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      username: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      role: string;
      isVerified: boolean;
      _id: string;
      createdAt: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    accessToken: string;
    user: LoginResponse["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    user?: LoginResponse["user"];
  }
}

