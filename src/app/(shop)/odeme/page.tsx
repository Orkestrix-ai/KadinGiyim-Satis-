import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { redirect } from "next/navigation"
import { CheckoutForm } from "./checkout-form"

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
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">ModaCini</Link>
          <Link href="/sepet" className="text-sm font-medium">Sepet</Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Ödeme</h1>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <CheckoutForm addresses={addresses} total={Number(total)} />
          </div>

          <div className="md:col-span-2">
            <div className="border rounded-xl p-6 space-y-4">
              <h2 className="font-semibold">Sipariş Özeti</h2>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.variant.product.name} ({item.variant.size}/{item.variant.color}) x{item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(Number(item.variant.product.price) * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-4 flex justify-between font-bold">
                <span>Toplam</span>
                <span>{formatPrice(Number(total))}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
