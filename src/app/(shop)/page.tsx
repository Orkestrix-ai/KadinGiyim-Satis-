import { prisma } from "@/lib/db"
import Link from "next/link"

export default async function HomePage() {
  const categories = await prisma.category.findMany()

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            ModaCini
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary/80 transition-colors">
              Ana Sayfa
            </Link>
            <Link href="/products" className="text-sm font-medium hover:text-primary/80 transition-colors">
              Ürünler
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium">
              Giriş Yap
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-br from-pink-50 via-white to-purple-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Yeni Sezon
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              En yeni kadın giyim koleksiyonunu keşfedin. Şıklığınızı tamamlayacak parçalar sizi bekliyor.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Alışverişe Başla
            </Link>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Kategoriler</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className="group relative aspect-square rounded-xl bg-muted overflow-hidden flex items-center justify-center"
                >
                  <span className="text-lg font-medium group-hover:scale-105 transition-transform">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 ModaCini. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
