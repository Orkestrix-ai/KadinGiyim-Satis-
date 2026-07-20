"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteCategoryButton({ id, name, hasProducts }: { id: string; name: string; hasProducts: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (hasProducts) {
      alert("Bu kategoride ürünler var. Önce ürünleri taşıyın veya silin.")
      return
    }
    if (!confirm(`"${name}" kategorisini silmek istediğinize emin misiniz?`)) return
    setLoading(true)
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" })
    if (res.ok) {
      router.refresh()
    } else {
      const data = await res.json()
      alert(data.error ?? "Silme hatası")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading || hasProducts}
      className="text-sm text-destructive hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "..." : "Sil"}
    </button>
  )
}
