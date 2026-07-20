"use client"

import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils"

interface CartItem {
  id: string
  variantId: string
  quantity: number
  productName: string
  productSlug: string
  size: string
  color: string
  price: number
  image: string | null
}

interface Props {
  items: CartItem[]
}

export function CartClient({ items }: Props) {
  const router = useRouter()
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  async function updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) return
    await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, quantity }),
    })
    router.refresh()
  }

  async function removeItem(itemId: string) {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    })
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 border rounded-xl p-4">
            <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium">{item.productName}</h3>
              <p className="text-sm text-muted-foreground">
                {item.size} / {item.color}
              </p>
              <p className="text-sm font-semibold mt-1">{formatPrice(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-lg border text-sm hover:bg-muted"
              >
                -
              </button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-lg border text-sm hover:bg-muted"
              >
                +
              </button>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
              <button
                onClick={() => removeItem(item.id)}
                className="text-xs text-destructive hover:underline mt-1"
              >
                Kaldır
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-bold">Toplam</span>
          <span className="text-2xl font-bold">{formatPrice(total)}</span>
        </div>
        <form action="/odeme" method="GET">
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Ödemeye Geç
          </button>
        </form>
      </div>
    </div>
  )
}
