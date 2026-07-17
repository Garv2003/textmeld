"use client";

import { ThemeProvider } from "@/context/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider defaultTheme="dark">
            {children}
            <Toaster />
        </ThemeProvider>
    );
};
