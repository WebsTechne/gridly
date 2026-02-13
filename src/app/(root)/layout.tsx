import { ReactNode } from "react";
import { Navbar } from "comps/navbar";
import Link from "next/link";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-999 flex h-16 items-center justify-between border-b px-4 py-2">
        <Link
          href="/"
          className="hover:text-primary text-4xl font-black duration-300"
        >
          Gridly
        </Link>

        <Navbar />
      </header>
      <main className="flex flex-col gap-4 py-5 [&>section]:w-full [&>section]:px-4">
        {children}
      </main>
    </>
  );
}
