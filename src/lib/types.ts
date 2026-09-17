export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  photos: string[];
  created_at: string;
  updated_at: string;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}
