"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User as UserIcon } from "lucide-react";

const desktopNavItems = [
  { name: "Home", href: "/" },
  { name: "News", href: "/news" },
  { name: "Videos", href: "/videos" },
  { name: "Journals", href: "/journals" },
  { name: "Search", href: "/search" },
  { name: "About", href: "/about" },
];

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-primary">
            OW CATALYST
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {desktopNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {session ? (
            <div className="flex items-center space-x-4">
              <Link
                href="/profile"
                className="hidden md:flex items-center space-x-2 rounded-md bg-primary text-white px-4 py-2 text-sm font-bold shadow-sm hover:bg-primary/90"
              >
                Portal
              </Link>
              {(session.user as any).role === "ADMIN" || (session.user as any).role === "FACULTY" || (session.user as any).role === "STAFF" ? (
                <Link
                  href="/publish"
                  className="hidden md:flex items-center space-x-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20"
                >
                  Publish
                </Link>
              ) : null}
              <button
                onClick={() => signOut()}
                className="hidden md:flex items-center space-x-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Portal
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
