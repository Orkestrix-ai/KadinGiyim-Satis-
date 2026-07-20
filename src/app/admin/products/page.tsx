import { prisma } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { DeleteButton } from "./delete-button"

const PAGE_SIZE = 20

export default async function AdminProductsPage(props: {
  searchParams?: Promise<{ q?: string; page?: string }>
}) {
  const searchParams = await props.searchParams
  const q = searchParams?.q?.toLowerCase() ?? ""
  const page = Math.max(1, parseInt(searchParams?.page ?? "1", 10) || 1)

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { category: { name: { contains: q, mode: "insensitive" as const } } },
        ],
      }
    : {}

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, variants: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Ürünler</h1>
        <div className="flex gap-3">
          <form method="GET" className="flex gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder="Ürün ara..."
              className="w-48 px-3 py-2 border rounded-lg text-sm"
            />
            <button type="submit" className="px-3 py-2 border rounded-lg text-sm hover:bg-muted">
              Ara
            </button>
          </form>
          <Link
            href="/admin/products/ekle"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            + Yeni Ürün
          </Link>
        </div>
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
                  {q ? `"${q}" için sonuç bulunamadı.` : "Henüz ürün yok."}
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0)
                return (
                  <tr key={product.id} className="border-b last:border-0 group">
                    <td className="p-3 font-medium">{product.name}</td>
                    <td className="p-3 text-muted-foreground">{product.category.name}</td>
                    <td className="p-3">{formatPrice(Number(product.price))}</td>
                    <td className="p-3">{product.variants.length}</td>
                    <td className="p-3">
                      <span
                        className={
                          totalStock === 0
                            ? "text-destructive font-medium"
                            : totalStock <= 5
                            ? "text-yellow-600 font-medium"
                            : ""
                        }
                      >
                        {totalStock}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/duzenle`}
                          className="text-sm text-primary hover:underline"
                        >
                          Düzenle
                        </Link>
                        <DeleteButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            {totalCount} üründen {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalCount)} gösteriliyor
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/products?${new URLSearchParams({ q, page: String(page - 1) })}`}
                className="px-3 py-1.5 border rounded-lg hover:bg-muted"
              >
                ← Önceki
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/products?${new URLSearchParams({ q, page: String(page + 1) })}`}
                className="px-3 py-1.5 border rounded-lg hover:bg-muted"
              >
                Sonraki →
              </Link>
            )}
          </div>
        </div>
      )}

      {totalPages <= 1 && (
        <p className="text-xs text-muted-foreground">
          {products.length} / {totalCount} ürün gösteriliyor
        </p>
      )}
    </div>
  )
}
