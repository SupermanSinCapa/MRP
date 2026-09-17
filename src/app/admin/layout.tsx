import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { SignOutButton } from "@/components/admin/sign-out-button";

export default function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-screen flex-col bg-sand-50">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/admin/products"
            className="flex items-center gap-3 font-heading text-lg font-semibold"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-sage-100">
              <PackageOpen className="size-4.5 text-sage-700" />
            </span>
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
