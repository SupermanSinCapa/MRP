"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(
    product ? String(product.price) : "",
  );
  const [active, setActive] = useState(product?.active ?? true);
  const [photos, setPhotos] = useState<string[]>(product?.photos ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleUpload(files: FileList) {
    const supabase = createClient();
    setUploading(true);
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const path = `${crypto.randomUUID()}/${crypto.randomUUID()}`;
      const { error } = await supabase.storage
        .from("product-photos")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (error) {
        toast.error(`Could not upload "${file.name}"`, {
          description: error.message,
        });
        continue;
      }

      const { data } = supabase.storage
        .from("product-photos")
        .getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    setPhotos((prev) => [...prev, ...uploaded]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsedPrice = Number(price);

    if (!name.trim()) {
      toast.error("The product name is required");
      return;
    }
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      toast.error("Enter a valid price");
      return;
    }

    const supabase = createClient();
    setSaving(true);

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      active,
      photos,
      updated_at: new Date().toISOString(),
    };

    const { error } = product
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert(payload);

    setSaving(false);

    if (error) {
      toast.error("Could not save the product", {
        description: error.message,
      });
      return;
    }

    toast.success(product ? "Product updated" : "Product created");
    router.push("/admin/products");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/products">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="font-heading text-3xl font-semibold">
          {product ? "Edit product" : "New product"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {product
            ? "Update the product details."
            : "Fill in the details to add a product to the catalog."}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. White rice — 25 lb bag"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Presentation, origin, packaging details..."
          className="min-h-28"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price (USD) *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        <div className="flex items-center gap-3 pt-8">
          <Switch
            id="active"
            checked={active}
            onCheckedChange={setActive}
          />
          <Label htmlFor="active" className="cursor-pointer">
            Visible in the catalog
          </Label>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Photos</Label>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {photos.map((url) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-sage-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt="Product photo"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setPhotos((prev) => prev.filter((p) => p !== url))}
                aria-label="Remove photo"
                className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-ink/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-sand-300 text-muted-foreground transition-colors hover:border-sage-400 hover:text-sage-600 disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                <Upload className="size-5" />
                <span className="text-xs">Upload</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          The first photo is used as the cover in the catalog.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) void handleUpload(e.target.files);
          }}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving} className="rounded-full px-8">
          {saving ? "Saving..." : product ? "Save changes" : "Create product"}
        </Button>
        <Button asChild variant="ghost" className="rounded-full">
          <Link href="/admin/products">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
