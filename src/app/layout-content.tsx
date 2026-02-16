"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "provs/theme-provider";
import { TooltipProvider } from "comps/ui/tooltip";
import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";

const Toaster = () => {
  const { theme } = useTheme();
  return (
    <Sonner
      duration={2000}
      position="top-center"
      theme={theme as "light" | "dark" | "system" | undefined}
    />
  );
};

export default function LayoutContent({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}
