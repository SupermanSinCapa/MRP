import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const bodyFont = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const serifFont = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MRP Supply LLC — Wholesale Food Products",
  description:
    "Wholesale distribution of food products from multiple suppliers. Pantry essentials, cooking products, frozen foods and bulk supplies.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${serifFont.variable} h-full antialiased`}
    >
      <body className="paper-texture min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
