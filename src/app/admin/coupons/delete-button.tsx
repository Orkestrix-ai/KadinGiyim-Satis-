"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteCouponButton({ id, code }: { id: string; code: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`"${code}" kuponunu silmek istediğinize emin misiniz?`)) return
    setLoading(true)
    const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" })
    if (res.ok) {
      router.refresh()
    } else {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-destructive hover:underline disabled:opacity-50"
    >
      {loading ? "..." : "Sil"}
    </button>
  )
}
