import { prisma } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ürünler</h1>
        <Link
          href="/admin/products/ekle"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Yeni Ürün
        </Link>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Ürün</th>
              <th className="text-left p-3 font-medium">Kategori</th>
              <th className="text-left p-3 font-medium">Fiyat</th>
              <th className="text-left p-3 font-medium">Varyasyon</th>
              <th className="text-left p-3 font-medium">Stok</th>
              <th className="text-right p-3 font-medium">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  Henüz ürün yok.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0)
                return (
                  <tr key={product.id} className="border-b last:border-0">
                    <td className="p-3 font-medium">{product.name}</td>
                    <td className="p-3 text-muted-foreground">{product.category.name}</td>
                    <td className="p-3">{formatPrice(Number(product.price))}</td>
                    <td className="p-3">{product.variants.length}</td>
                    <td className="p-3">{totalStock}</td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/admin/products/${product.id}/duzenle`}
                        className="text-sm text-primary hover:underline"
                      >
                        Düzenle
                      </Link>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
