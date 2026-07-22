import { prisma } from "@/lib/db"
export const dynamic = "force-dynamic"
import { HeroScroll } from "@/components/home/HeroScroll"
import { CategoryProducts } from "@/components/home/CategoryProducts"

export default async function HomePage() {
  const heroProducts = (
    await prisma.product.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      where: { images: { isEmpty: false } },
      include: { category: true },
    })
  ).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: Number(p.price),
    images: p.images,
    category: { name: p.category.name },
  }))

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      products: {
        take: 8,
        orderBy: { createdAt: "desc" },
        where: { images: { isEmpty: false } },
      },
    },
  })

  return (
    <>
      <HeroScroll products={heroProducts}>
        {categories.length > 0 ? (
          categories.map((cat) => (
            <CategoryProducts
              key={cat.id}
              category={{ name: cat.name, slug: cat.slug }}
              products={cat.products.map((p) => ({
                slug: p.slug,
                name: p.name,
                price: Number(p.price),
                images: p.images,
                category: { name: cat.name },
              }))}
            />
          ))
        ) : (
          <section className="py-16 text-center text-muted-foreground">
            Henüz ürün bulunmuyor.
          </section>
        )}
      </HeroScroll>
    </>
  )
}
