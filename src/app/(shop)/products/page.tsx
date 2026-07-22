import { prisma } from "@/lib/db"
import Link from "next/link"
import { ProductCard } from "@/components/home/ProductCard"

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-4xl font-bold">Ürünler</h1>
          <p className="text-muted-foreground mt-1">
            {category
              ? `"${categories.find((c) => c.slug === category)?.name ?? category}" kategorisi`
              : "Tüm ürünlerimizi keşfedin"}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {products.length} ürün
        </p>
      </div>

      <div className="flex gap-2 mb-10 flex-wrap">
        <Link
          href="/products"
          className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
            !category
              ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
              : "bg-background hover:bg-muted border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Tümü
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
              category === cat.slug
                ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                : "bg-background hover:bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">Bu kategoride henüz ürün bulunmuyor.</p>
          <Link
            href="/products"
            className="inline-flex mt-4 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Tüm Ürünlere Dön
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                slug: product.slug,
                name: product.name,
                price: Number(product.price),
                images: product.images,
                category: { name: product.category.name },
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
