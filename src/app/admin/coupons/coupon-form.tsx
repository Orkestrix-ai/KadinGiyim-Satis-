"use client"

import { useRouter } from "next/navigation"

export function CouponForm() {
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    const res = await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.get("code"),
        discountType: form.get("discountType"),
        discountValue: parseFloat(form.get("discountValue") as string),
        minAmount: form.get("minAmount") ? parseFloat(form.get("minAmount") as string) : null,
        usageLimit: form.get("usageLimit") ? parseInt(form.get("usageLimit") as string) : null,
        expiresAt: form.get("expiresAt") || null,
      }),
    })

    if (res.ok) {
      router.refresh()
      e.currentTarget.reset()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-6 gap-3 max-w-3xl">
      <input name="code" placeholder="Kupon Kodu" required className="px-3 py-2 border rounded-lg text-sm" />
      <select name="discountType" required className="px-3 py-2 border rounded-lg text-sm">
        <option value="PERCENTAGE">Yüzde</option>
        <option value="FIXED">Sabit TL</option>
      </select>
      <input name="discountValue" type="number" step="0.01" placeholder="Değer" required className="px-3 py-2 border rounded-lg text-sm" />
      <input name="minAmount" type="number" step="0.01" placeholder="Min. Sepet (ops)" className="px-3 py-2 border rounded-lg text-sm" />
      <input name="usageLimit" type="number" placeholder="Kullanım Limiti" className="px-3 py-2 border rounded-lg text-sm" />
      <input name="expiresAt" type="date" className="px-3 py-2 border rounded-lg text-sm" />
      <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
        Ekle
      </button>
    </form>
  )
}
