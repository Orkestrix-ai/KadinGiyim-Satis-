import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import { redirect } from "next/navigation"
import { CheckoutForm } from "./checkout-form"
import { ShoppingBag } from "lucide-react"

export default async function CheckoutPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          variant: { include: { product: true } },
        },
      },
    },
  })

  const items = cart?.items ?? []
  if (items.length === 0) redirect("/sepet")

  const total = items.reduce((sum, item) => sum + Number(item.variant.product.price) * item.quantity, 0)
  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="font-heading text-3xl font-bold mb-8">Ödeme</h1>

      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-3">
          <CheckoutForm addresses={addresses} total={Number(total)} />
        </div>

        <div className="lg:col-span-2">
          <div className="border rounded-2xl p-6 space-y-4 sticky top-24">
            <h2 className="font-heading text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="size-5" />
              Sipariş Özeti
            </h2>
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3">
                  <div className="size-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    {item.variant.product.images[0] && (
                      <img src={item.variant.product.images[0]} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.variant.product.name}</p>
                    <p className="text-xs text-muted-foreground">{item.variant.size} / {item.variant.color} x{item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium whitespace-nowrap">
                    {formatPrice(Number(item.variant.product.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ara Toplam</span>
                <span>{formatPrice(Number(total))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kargo</span>
                <span className="text-muted-foreground">Hesaplanacak</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Toplam</span>
                <span className="text-primary">{formatPrice(Number(total))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
