import { ReactNode } from "react";
import { Navbar } from "comps/navbar";
import Link from "next/link";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="z-999 flex h-16 items-center justify-between border-b px-3 py-2">
        <Link
          href="/"
          className="hover:text-primary text-[clamp(1.3rem,2vw,2.25rem)] font-black duration-300"
        >
          Gridly
        </Link>

        <Navbar />
      </header>
      <main className="flex flex-col gap-4 py-5 [&>section]:w-full [&>section]:px-3">
        {children}
      </main>
    </>
  );
}
