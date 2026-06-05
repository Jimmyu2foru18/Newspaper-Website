# Part 4: The Master Blueprint (Auth & UI)

Before users interact, we need a secure entry and a consistent look.

### 1. The Header Component (The Navigation Bar)
Create `src/components/layout/Header.tsx`. This component handles the logo, navigation links, and login/logout state.

**How to code it:**
```tsx
"use client"; // Required for interactivity like hooks

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const { data: session } = useSession(); // 1. Check if user is logged in

  return (
    <header className="border-b bg-white p-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-primary text-xl">OW CATALYST</Link>
      <nav className="flex gap-4">
        <Link href="/news">News</Link>
        {session ? (
          <>
            {/* 2. Admin/Editor only button */}
            {(session.user as any).role === "ADMIN" && <Link href="/publish">Publish</Link>}
            <button onClick={() => signOut()}>Sign Out</button>
          </>
        ) : (
          <Link href="/login">Sign In</Link>
        )}
      </nav>
    </header>
  );
}
```
**The Breakdown:**
*   `"use client"`: Tells Next.js this file uses interactive features.
*   `useSession()`: A hook that fetches the current user's login state.
*   `{session ? ... : ...}`: This is a "ternary operator"—a shortcut for saying "If logged in, show this; otherwise, show that."

---
### 2. The Layout Wrapper
Open `src/app/layout.tsx`. This file wraps every single page in your app.

**How to code it:**
1. Import your `Header`, `Footer`, and `SessionProvider`.
2. Wrap the `{children}` (the current page content) with these providers.
```tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
```
*Why:* By putting the header here, you only have to write it once, and it instantly applies to every page on your site.
