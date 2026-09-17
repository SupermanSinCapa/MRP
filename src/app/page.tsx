import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-4xl tracking-tight">Hola Mundo</CardTitle>
          <CardDescription>
            Next.js + TypeScript + Tailwind CSS + shadcn/ui
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Proyecto listo para conectar con Supabase y desplegar en Vercel.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button asChild>
            <Link href="https://vercel.com/new" target="_blank">
              Desplegar en Vercel
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
