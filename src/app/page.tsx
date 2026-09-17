import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, Store } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { type Product, formatPrice } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

async function getActiveProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching products:", error.message);
      return [];
    }
    return (data as Product[]) ?? [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

function ProductCard({ product }: { product: Product }) {
  const cover = product.photos[0];

  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-sage-100">
        {cover ? (
          <Image
            src={cover}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sage-400">
            <Store className="size-12" strokeWidth={1.5} />
          </div>
        )}
      </div>
      <div className="space-y-2 p-5">
        <h3 className="font-heading text-lg font-semibold">{product.name}</h3>
        {product.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
        )}
        <p className="font-heading text-xl font-semibold text-terracota-600">
          {formatPrice(Number(product.price))}
        </p>
      </div>
    </article>
  );
}

export default async function Home() {
  let user = null;
  let products: Product[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      user = data.user;
      products = await getActiveProducts();
    } catch (error) {
      console.error("Supabase error on landing:", error);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-sand-50/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="MRP Supply LLC"
              width={40}
              height={44}
              className="rounded-md bg-white object-contain p-0.5 shadow-sm ring-1 ring-border"
              priority
            />
            <span className="font-heading text-xl font-semibold">
              MRP Supply <span className="text-sage-600">LLC</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="#catalog"
              className="hidden transition-colors hover:text-sage-600 sm:block"
            >
              Catalog
            </Link>
            <Link
              href="#about"
              className="hidden transition-colors hover:text-sage-600 sm:block"
            >
              About
            </Link>
            <Link
              href="#contact"
              className="hidden transition-colors hover:text-sage-600 sm:block"
            >
              Contact
            </Link>
            {user && (
              <Button asChild variant="secondary" size="sm">
                <Link href="/admin/products">Manage products</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 py-20 text-center md:py-28">
          <Image
            src="/logo.png"
            alt="MRP Supply LLC"
            width={137}
            height={150}
            className="mx-auto mb-10 rounded-2xl bg-white object-contain p-2 shadow-md ring-1 ring-border"
            priority
          />
          <Badge
            variant="secondary"
            className="mb-6 rounded-full border border-sage-300 bg-sage-50 px-4 py-1 text-sm font-medium text-sage-700"
          >
            Wholesale · Bulk quantities
          </Badge>
          <h1 className="mx-auto max-w-3xl font-heading text-4xl font-semibold md:text-5xl">
            Wholesale food products from{" "}
            <span className="text-sage-600">multiple suppliers</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Pantry essentials, cooking products, frozen foods and other
            high-demand food supplies — in practical bulk presentations,
            delivered with a simple and convenient purchasing experience.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 text-base"
            >
              <Link href="#catalog">Browse the catalog</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-8 text-base"
            >
              <Link href="#contact">Contact us</Link>
            </Button>
          </div>
        </section>

        {/* Catalog */}
        <section
          id="catalog"
          className="scroll-mt-20 border-y border-border/60 bg-sand-100/50 py-20"
        >
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-3xl font-semibold">Our catalog</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Active listings from our suppliers. Orders preferably over $100.
            </p>

            {products.length === 0 ? (
              <div className="mt-12 rounded-xl border border-dashed border-sand-300 bg-card p-12 text-center text-muted-foreground">
                <p className="font-heading text-lg font-medium text-foreground">
                  The catalog is coming soon.
                </p>
                <p className="mt-2 text-sm">
                  New products will appear here as our suppliers add them.
                </p>
              </div>
            ) : (
              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* About */}
        <section id="about" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="font-heading text-3xl font-semibold">
              About MRP Supply LLC
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-foreground/90">
              <p>
                MRP Supply LLC is dedicated to the wholesale distribution of a
                variety of food products sourced from multiple suppliers. Our
                catalog includes essential pantry items, cooking products,
                frozen foods, and other high-demand food supplies offered in
                practical bulk presentations.
              </p>
              <p>
                We focus on providing a simple and convenient purchasing
                experience for customers looking to buy in quantity, with
                orders preferably over $100.
              </p>
              <p>
                Our goal is straightforward: a diverse selection of food
                products, competitive wholesale pricing, and convenient access
                to bulk quantities from different suppliers.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="scroll-mt-20 border-t border-border/60 bg-sage-50 py-20"
        >
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-heading text-3xl font-semibold">
              Get in touch
            </h2>
            <p className="mt-3 text-muted-foreground">
              Ready to place an order or have a question? Reach out any time.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <a
                href="mailto:mrpsupply2026@gmail.com"
                className="group rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <Mail className="mx-auto mb-3 size-6 text-terracota-500" />
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="mt-1 font-medium group-hover:text-sage-600">
                  mrpsupply2026@gmail.com
                </p>
              </a>
              <a
                href="tel:+17132815484"
                className="group rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <Phone className="mx-auto mb-3 size-6 text-terracota-500" />
                <p className="text-sm font-medium text-muted-foreground">
                  Phone
                </p>
                <p className="mt-1 font-medium group-hover:text-sage-600">
                  713-281-5484
                </p>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MRP Supply LLC · Wholesale Food Products
        </p>
      </footer>
    </div>
  );
}
