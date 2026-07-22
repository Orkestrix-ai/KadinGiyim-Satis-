import Link from "next/link"
import { ProductCard } from "./ProductCard"

interface CategoryProductsCategory {
  name: string
  slug: string
}

interface CategoryProductsProduct {
  slug: string
  name: string
  price: number
  images: string[]
  category: { name: string }
}

export function CategoryProducts({
  category,
  products,
}: {
  category: CategoryProductsCategory
  products: CategoryProductsProduct[]
}) {
  if (products.length === 0) return null

  return (
    <section className="py-14 md:py-20 border-b last:border-b-0">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">{category.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {category.name} kategorisindeki ürünleri keşfedin
            </p>
          </div>
          <Link
            href={`/products?category=${category.slug}`}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Tümünü Gör
            <span className="text-lg leading-none">&rarr;</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link
            href={`/products?category=${category.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary"
          >
            Tümünü Gör
            <span className="text-lg leading-none">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
