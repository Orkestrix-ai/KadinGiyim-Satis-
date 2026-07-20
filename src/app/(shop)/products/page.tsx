import { prisma } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const products = await prisma.product.findMany({
    where: category ? { category: { slug: category } } : undefined,
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  })

  const categories = await prisma.category.findMany()

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            ModaCini
          </Link>
          <Link href="/" className="text-sm font-medium hover:text-primary/80 transition-colors">
            Ana Sayfa
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Ürünler</h1>

        <div className="flex gap-2 mb-8 flex-wrap">
          <Link
            href="/products"
            className={`px-4 py-2 rounded-full text-sm border transition-colors ${!category ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
          >
            Tümü
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${category === cat.slug ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {products.length === 0 ? (
          <p className="text-muted-foreground">Henüz ürün bulunmuyor.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group"
              >
                <div className="aspect-[3/4] bg-muted rounded-xl mb-3 overflow-hidden">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{product.category.name}</p>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm font-semibold">{formatPrice(Number(product.price))}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
