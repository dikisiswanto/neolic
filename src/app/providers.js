"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {children}
        <Toaster />
      </SessionProvider>
    </QueryClientProvider>
  );
}
