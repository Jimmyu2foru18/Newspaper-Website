import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} Old Westbury Catalyst. All rights reserved.
        </div>
        <nav className="flex gap-6 text-sm font-medium text-gray-600">
          <Link href="/about" className="hover:text-primary">About</Link>
          <Link href="/policy" className="hover:text-primary">Editorial Policy</Link>
          <Link href="/contact" className="hover:text-primary">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
