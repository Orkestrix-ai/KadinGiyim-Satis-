"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface Category {
  id: string
  name: string
  slug: string
}

interface Props {
  categories: Category[]
  initialData?: {
    id: string
    name: string
    slug: string
    description: string | null
    price: number
    categoryId: string
  }
  variants?: { size: string; color: string; sku: string; stock: number }[]
}

export function ProductForm({ categories, initialData, variants: initialVariants }: Props) {
  const router = useRouter()
  const [variants, setVariants] = useState<{ size: string; color: string; sku: string; stock: number }[]>(
    initialVariants ?? []
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    const body = {
      name: form.get("name"),
      slug: form.get("slug"),
      description: form.get("description"),
      price: parseFloat(form.get("price") as string),
      categoryId: form.get("categoryId"),
      variants,
    }

    const url = initialData ? `/api/products/${initialData.id}` : "/api/products"
    const method = initialData ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      router.push("/admin/products")
      router.refresh()
    }
  }

  function addVariant() {
    setVariants([...variants, { size: "", color: "", sku: "", stock: 0 }])
  }

  function updateVariant(index: number, field: string, value: string | number) {
    const updated = variants.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    setVariants(updated)
  }

  function removeVariant(index: number) {
    setVariants(variants.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ürün Adı</label>
          <input
            name="name"
            defaultValue={initialData?.name}
            required
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            name="slug"
            defaultValue={initialData?.slug}
            required
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Açıklama</label>
        <textarea
          name="description"
          defaultValue={initialData?.description ?? ""}
          className="w-full px-3 py-2 border rounded-lg text-sm min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Fiyat (TL)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            defaultValue={initialData?.price}
            required
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <select
            name="categoryId"
            defaultValue={initialData?.categoryId}
            required
            className="w-full px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">Seçiniz</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Varyasyonlar</h3>
          <button type="button" onClick={addVariant} className="text-sm text-primary hover:underline">
            + Varyasyon Ekle
          </button>
        </div>
        {variants.map((v, i) => (
          <div key={i} className="flex gap-2 items-start">
            <input
              placeholder="Beden"
              value={v.size}
              onChange={(e) => updateVariant(i, "size", e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
            />
            <input
              placeholder="Renk"
              value={v.color}
              onChange={(e) => updateVariant(i, "color", e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
            />
            <input
              placeholder="SKU"
              value={v.sku}
              onChange={(e) => updateVariant(i, "sku", e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
            />
            <input
              placeholder="Stok"
              type="number"
              value={v.stock}
              onChange={(e) => updateVariant(i, "stock", parseInt(e.target.value) || 0)}
              className="w-20 px-3 py-2 border rounded-lg text-sm"
            />
            <button type="button" onClick={() => removeVariant(i)} className="px-3 py-2 text-sm text-destructive hover:underline">
              Sil
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          {initialData ? "Güncelle" : "Kaydet"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
        >
          İptal
        </button>
      </div>
    </form>
  )
}
