import { ReactNode } from "react";
import { ThemeProvider } from "provs/theme-provider";
import { TooltipProvider } from "comps/ui/tooltip";

export default function LayoutContent({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
