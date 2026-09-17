import Link from "next/link";
import Image from "next/image";
import { SignOutButton } from "@/components/admin/sign-out-button";

export default function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-screen flex-col bg-sand-50">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 font-heading text-lg font-semibold">
            <Image
              src="/logo.png"
              alt="MRP Supply LLC"
              width={33}
              height={36}
              className="rounded-lg bg-white object-contain p-0.5 shadow-sm ring-1 ring-border"
              priority
            />
            MRP Supply
            <span className="text-xs font-normal uppercase tracking-widest text-muted-foreground">
              admin
            </span>
          </Link>
          <SignOutButton />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
