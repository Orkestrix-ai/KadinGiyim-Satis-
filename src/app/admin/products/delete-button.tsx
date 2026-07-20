"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`"${name}" ürününü silmek istediğinize emin misiniz?`)) return
    setLoading(true)
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
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
      disabled={loading}
      className="text-sm text-destructive hover:underline disabled:opacity-50"
    >
      {loading ? "..." : "Sil"}
    </button>
  )
}
