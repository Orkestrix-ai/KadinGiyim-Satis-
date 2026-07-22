"use client"

import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react"
import Link from "next/link"

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
          <div key={item.id} className="flex gap-4 border rounded-2xl p-4 bg-card hover:shadow-sm transition-shadow">
            <div className="size-20 md:size-24 bg-muted rounded-xl flex-shrink-0 overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.productSlug}`} className="font-medium hover:text-primary transition-colors line-clamp-1">
                {item.productName}
              </Link>
              <p className="text-sm text-muted-foreground mt-0.5">
                {item.size} / {item.color}
              </p>
              <p className="text-sm font-semibold mt-1 text-primary">{formatPrice(item.price)}</p>
            </div>
            <div className="flex flex-col items-end justify-between">
              <button
                onClick={() => removeItem(item.id)}
                className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                aria-label="Kaldır"
              >
                <Trash2 className="size-4" />
              </button>
              <div className="flex items-center gap-1 border rounded-xl p-0.5">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="size-7 rounded-lg hover:bg-muted flex items-center justify-center cursor-pointer"
                  aria-label="Azalt"
                >
                  <Minus className="size-3" />
                </button>
                <span className="w-8 text-center text-sm font-medium tabular-nums">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="size-7 rounded-lg hover:bg-muted flex items-center justify-center cursor-pointer"
                  aria-label="Arttır"
                >
                  <Plus className="size-3" />
                </button>
              </div>
              <p className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-base">Ara Toplam</span>
          <span className="text-base">{formatPrice(total)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-base">Kargo</span>
          <span className="text-sm text-muted-foreground">Teslimat adresine göre hesaplanacak</span>
        </div>
        <div className="border-t pt-4 flex items-center justify-between">
          <span className="text-xl font-bold">Toplam</span>
          <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
        </div>
        <form action="/odeme" method="GET">
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <ShoppingBag className="size-4" />
            Ödemeye Geç
          </button>
        </form>
      </div>
    </div>
  )
}