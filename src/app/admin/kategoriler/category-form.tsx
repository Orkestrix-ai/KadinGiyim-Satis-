"use client"

import { useRouter } from "next/navigation"

export function CategoryForm() {
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

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
    }
  }

  return (
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
        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
      >
        Ekle
      </button>
    </form>
  )
}
