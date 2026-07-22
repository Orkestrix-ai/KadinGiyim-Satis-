import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
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
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="font-heading text-3xl font-bold mb-2">Sepetim</h1>
      <p className="text-sm text-muted-foreground mb-8">{items.length} ürün</p>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <p className="text-muted-foreground mb-6">Sepetiniz boş.</p>
          <Link
            href="/products"
            className="inline-flex px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25"
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
    </div>
  )
}
