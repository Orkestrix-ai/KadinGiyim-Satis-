import { prisma } from "@/lib/db"
import { CategoryForm } from "./category-form"

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Kategoriler</h1>

      <CategoryForm />

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Kategori</th>
              <th className="text-left p-3 font-medium">Slug</th>
              <th className="text-left p-3 font-medium">Ürün Sayısı</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b last:border-0">
                <td className="p-3 font-medium">{cat.name}</td>
                <td className="p-3 text-muted-foreground">{cat.slug}</td>
                <td className="p-3">{0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
