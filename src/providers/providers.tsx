"use client";

import { SessionProvider } from "next-auth/react";
import ReactQueryProvider from "./react-query-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
export function Providers({ children }: { children: React.ReactNode }) {
    return <SessionProvider>
        <ReactQueryProvider>
                  <ReactQueryDevtools initialIsOpen={false} />

            {children}
        </ReactQueryProvider>
    </SessionProvider>;
}
