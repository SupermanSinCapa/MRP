"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!configured) return;
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const supabase = createClient();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        const message =
          signInError.message === "Email not confirmed"
            ? "The email is not confirmed. Ask the administrator to enable Auto Confirm for this user."
            : "Invalid email or password. Try again.";
        setError(message);
        toast.error(message);
        return;
      }
    } catch {
      const message = "Connection error. Check your internet and try again.";
      setError(message);
      toast.error(message);
      return;
    } finally {
      setLoading(false);
    }

    // Full navigation so the server-side guard sees the new session cookies.
    router.replace("/admin/products");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex justify-center">
            <Image
              src="/logo.png"
              alt="MRP Supply LLC"
              width={95}
              height={104}
              className="rounded-xl bg-white object-contain p-1 shadow-sm ring-1 ring-border"
              priority
            />
          </div>
          <CardTitle className="font-heading text-2xl">MRP Supply</CardTitle>
          <CardDescription>Sign in to manage the catalog</CardDescription>
        </CardHeader>
        <CardContent>
          {configured ? (
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            {error && (
              <p
                role="alert"
                className="rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive"
              >
                {error}
              </p>
            )}
          </form>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              The service is not configured yet. Check back later.
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
