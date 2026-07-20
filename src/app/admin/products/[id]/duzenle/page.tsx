import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { ProductForm } from "../../ekle/product-form"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true, category: true },
  })

  if (!product) notFound()

  const categories = await prisma.category.findMany()

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Ürün Düzenle</h1>
      <ProductForm
        categories={categories}
        initialData={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: Number(product.price),
          categoryId: product.categoryId,
        }}
        variants={product.variants.map((v) => ({
          size: v.size,
          color: v.color,
          sku: v.sku,
          stock: v.stock,
        }))}
      />
    </div>
  )
}
