import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { redirect } from "next/navigation"
import { CartClient } from "./cart-client"

export default async function CartPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
  })

  const items = cart?.items ?? []

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">ModaCini</Link>
          <Link href="/products" className="text-sm font-medium">Ürünler</Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Sepetim</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">Sepetiniz boş.</p>
            <Link
              href="/products"
              className="inline-flex px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <CartClient items={items.map((item) => ({
            id: item.id,
            variantId: item.variantId,
            quantity: item.quantity,
            productName: item.variant.product.name,
            productSlug: item.variant.product.slug,
            size: item.variant.size,
            color: item.variant.color,
            price: Number(item.variant.product.price),
            image: item.variant.product.images[0] ?? null,
          }))} />
        )}
      </main>
    </div>
  )
}
