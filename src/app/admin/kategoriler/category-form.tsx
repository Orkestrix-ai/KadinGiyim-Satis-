"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function CategoryForm() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    const form = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          slug: form.get("slug"),
        }),
      })

      if (res.ok) {
        router.refresh()
        e.currentTarget.reset()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? "Kategori eklenemedi")
      }
    } catch {
      setError("Bağlantı hatası")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-2">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-3 max-w-md">
        <input
          name="name"
          placeholder="Kategori adı"
          required
          className="flex-1 px-3 py-2 border rounded-lg text-sm"
        />
        <input
          name="slug"
          placeholder="slug-adi"
          required
          className="flex-1 px-3 py-2 border rounded-lg text-sm"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
        >
          {submitting ? "..." : "Ekle"}
        </button>
      </form>
    </div>
  )
}
