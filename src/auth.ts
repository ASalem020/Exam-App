import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginResponse } from "./lib/types/auth";
import { ApiResponse } from "./lib/types/api";

export const authOptions: NextAuthOptions = {

  pages: {
    signIn: '/login'
  },
  providers: [
    Credentials(
      {
        name: "Credentials",
        credentials: {
          email: {},
          password: {},
        },
        authorize: async (credentials) => {
          const response = await fetch(`${process.env.API}/auth/signin`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const payload: ApiResponse<LoginResponse> = await response.json();
          if ("code" in payload) throw new Error(payload.message);

          return {
            id: payload.user._id,
            accessToken: payload.token,
            user: payload.user,


          };
        },
      }),
  ],
  callbacks: {
    jwt: ({ token, user, trigger, session }) => {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.user = user.user;
      }

      if (trigger === "update" && session) {
        if (session.user) {
          token.user = {
            ...token.user,
            ...session.user
          }
        }
        if (session.accessToken) {
          token.accessToken = session.accessToken
        }
      }

      return token;
    },
    session: ({ session, token }) => {
      if (token && token.user) {
        session.user = {
          ...token.user,
          id: token.id || token.user._id,
        };
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
