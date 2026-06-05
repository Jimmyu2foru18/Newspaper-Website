"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Newspaper, Video, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "News", href: "/news", icon: Newspaper },
  { name: "Videos", href: "/videos", icon: Video },
  { name: "Search", href: "/search", icon: Search },
  { name: "Profile", href: "/profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-white px-4 md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 transition-colors",
              isActive ? "text-primary" : "text-gray-500 hover:text-primary"
            )}
          >
            <Icon className="h-6 w-6" />
            <span className="text-xs font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
