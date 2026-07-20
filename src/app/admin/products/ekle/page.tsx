import { prisma } from "@/lib/db"
import { ProductForm } from "./product-form"

export default async function NewProductPage() {
  const categories = await prisma.category.findMany()

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Yeni Ürün</h1>
      <ProductForm categories={categories} />
    </div>
  )
}
