"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { type Product, formatPrice } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    void (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });

      if (ignore) return;
      if (error) {
        toast.error("Error loading products", { description: error.message });
        setLoading(false);
        return;
      }
      setProducts((data as Product[]) ?? []);
      setLoading(false);
    })();

    return () => {
      ignore = true;
    };
  }, []);

  async function toggleActive(product: Product, nextActive: boolean) {
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .update({ active: nextActive, updated_at: new Date().toISOString() })
      .eq("id", product.id);

    if (error) {
      toast.error("Could not update the product", {
        description: error.message,
      });
      return;
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, active: nextActive } : p)),
    );
    toast.success(
      nextActive
        ? `"${product.name}" is now visible in the catalog`
        : `"${product.name}" was hidden from the catalog`,
    );
  }

  async function deleteProduct(product: Product) {
    const supabase = createClient();

    if (product.photos.length > 0) {
      const paths = product.photos
        .map((url) => {
          const marker = "/product-photos/";
          const index = url.indexOf(marker);
          return index >= 0 ? url.substring(index + marker.length) : null;
        })
        .filter((p): p is string => Boolean(p));

      if (paths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("product-photos")
          .remove(paths);
        if (storageError) {
          console.error("Could not remove photos:", storageError.message);
        }
      }
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      toast.error("Could not delete the product", {
        description: error.message,
      });
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    toast.success(`"${product.name}" was deleted`);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Only active products are visible in the public catalog.
          </p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/admin/products/new">
            <Plus className="size-4" />
            Add product
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl bg-sand-100"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-sand-300 bg-card p-16 text-center">
          <p className="font-heading text-lg font-medium">
            No products yet
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first product to start filling the catalog.
          </p>
          <Button asChild variant="secondary" className="mt-6 rounded-full">
            <Link href="/admin/products/new">
              <Plus className="size-4" />
              Add product
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sage-100 text-xs text-sage-400">
                {product.photos[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.photos[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "No photo"
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate font-heading font-semibold">
                    {product.name}
                  </h2>
                  <Badge
                    variant="secondary"
                    className={
                      product.active
                        ? "border border-sage-300 bg-sage-50 text-sage-700"
                        : "border border-dusk-300 bg-dusk-200/60 text-dusk-400"
                    }
                  >
                    {product.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="mt-0.5 text-sm text-terracota-600">
                  {formatPrice(Number(product.price))}
                </p>
                <p className="text-xs text-muted-foreground">
                  {product.photos.length} photo
                  {product.photos.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {product.active ? "Visible" : "Hidden"}
                  </span>
                  <Switch
                    checked={product.active}
                    onCheckedChange={(checked) =>
                      toggleActive(product, checked)
                    }
                    aria-label={`Toggle ${product.name}`}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    asChild
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${product.name}`}
                  >
                    <Link href={`/admin/products/${product.id}`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${product.name}`}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {`Delete "${product.name}"?`}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently removes the product and its photos.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-white hover:bg-destructive/90"
                          onClick={() => deleteProduct(product)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
