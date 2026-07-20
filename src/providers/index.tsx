"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useState, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
    // Prevents QueryClient from being shared across requests on the server
    const [queryClient] = useState(() => new QueryClient());

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
        >
            <QueryClientProvider client={queryClient}>
                {children}
                <Toaster richColors position="top-right" />
            </QueryClientProvider>
        </ThemeProvider>
    );
}