import { prisma } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, variants: true },
  })

  if (!product) notFound()

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            ModaCini
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium hover:text-primary/80 transition-colors">
              Ana Sayfa
            </Link>
            <Link href="/products" className="text-sm font-medium hover:text-primary/80 transition-colors">
              Ürünler
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-[3/4] bg-muted rounded-xl overflow-hidden">
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Görsel yok
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">{product.category.name}</p>
              <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
              <p className="text-2xl font-semibold mt-2">{formatPrice(Number(product.price))}</p>
            </div>

            {product.description && (
              <p className="text-muted-foreground">{product.description}</p>
            )}

            {product.variants.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Beden / Renk</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <div
                      key={v.id}
                      className={`px-4 py-2 rounded-lg text-sm border ${
                        v.stock > 0
                          ? "hover:bg-muted cursor-pointer"
                          : "opacity-50 line-through cursor-not-allowed"
                      }`}
                    >
                      {v.size} / {v.color}
                      {v.stock === 0 && " (Tükendi)"}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Sepete Ekle
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
