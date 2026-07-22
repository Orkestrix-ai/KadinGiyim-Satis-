import { prisma } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ShoppingBag, Heart } from "lucide-react"

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
    <div className="container mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground transition-colors">Ürünler</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-foreground transition-colors">
          {product.category.name}
        </Link>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="space-y-4">
          <div className="bg-muted rounded-2xl overflow-hidden aspect-[3/4]">
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
        </div>

        <div className="space-y-6 md:sticky md:top-24 md:self-start">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">{product.category.name}</p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold mt-1 leading-tight">{product.name}</h1>
            <p className="text-2xl md:text-3xl font-semibold mt-3 text-primary">{formatPrice(Number(product.price))}</p>
          </div>

          {product.description && (
            <div className="border-t pt-6">
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          )}

          {product.variants.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium mb-3">Beden / Renk</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <div
                    key={v.id}
                    className={`px-4 py-2.5 rounded-xl text-sm border transition-all ${
                      v.stock > 0
                        ? "border-border hover:border-primary hover:bg-primary/5 cursor-pointer"
                        : "opacity-40 line-through cursor-not-allowed bg-muted/50"
                    }`}
                  >
                    {v.size} / {v.color}
                    {v.stock === 0 && " (Tükendi)"}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-6 space-y-3">
            <form>
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <ShoppingBag className="size-4" />
                Sepete Ekle
              </button>
            </form>
            <button className="w-full py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors cursor-pointer inline-flex items-center justify-center gap-2">
              <Heart className="size-4" />
              Favorilere Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
