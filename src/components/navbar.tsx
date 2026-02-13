"use client";

import {
  Bookmark02Icon,
  Home09Icon,
  Moon02Icon,
  PlusSignCircleIcon,
  Sun02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";

const Navbar = () => {
  const pathname = usePathname();
  const LINKS: {
    name: string;
    path: string;
    icon: IconSvgElement;
    fill?: boolean;
  }[] = [
    { name: "Home", path: "/", icon: Home09Icon, fill: true },
    { name: "New table", path: "/new", icon: PlusSignCircleIcon },
    { name: "Saved", path: "/saved", icon: Bookmark02Icon, fill: true },
  ];

  const { resolvedTheme, setTheme } = useTheme();

  return (
    <nav className="flex h-12 items-center justify-between px-4 py-1">
      <ul className="flex flex-row items-center gap-3">
        {LINKS.map((link) => {
          const isActive = pathname === link.path;
          return (
            <li key={link.name}>
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    href={link.path}
                    className={cn(
                      "flex-center size-8",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <HugeiconsIcon
                      icon={link.icon}
                      strokeWidth={2}
                      className="size-6! text-inherit"
                      fill={link.fill && isActive ? "currentColor" : "none"}
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>{link.name}</TooltipContent>
              </Tooltip>
            </li>
          );
        })}

        <li>
          <Button
            variant="ghost"
            className="text-muted-foreground size-8 rounded-full"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            <HugeiconsIcon
              icon={resolvedTheme === "dark" ? Moon02Icon : Sun02Icon}
              strokeWidth={2}
              className="size-6! text-inherit"
            />
          </Button>
        </li>

        <li>
          <Tooltip>
            <TooltipTrigger>
              <span className="bg-muted inline-block size-6.5 rounded-full"></span>{" "}
            </TooltipTrigger>
            <TooltipContent>Profile</TooltipContent>
          </Tooltip>
        </li>
      </ul>
    </nav>
  );
};

export { Navbar };
