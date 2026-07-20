import Link from "next/link"
import { auth } from "@/lib/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r bg-muted/30 p-6 hidden md:block">
        <Link href="/admin" className="text-lg font-bold block mb-8">
          ModaCini Admin
        </Link>
        <nav className="space-y-2">
          <Link
            href="/admin"
            className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
          >
            Ürünler
          </Link>
          <Link
            href="/admin/orders"
            className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
          >
            Siparişler
          </Link>
          <Link
            href="/admin/kullanicilar"
            className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
          >
            Kullanıcılar
          </Link>
          <Link
            href="/admin/kategoriler"
            className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
          >
            Kategoriler
          </Link>
          <Link
            href="/admin/coupons"
            className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
          >
            Kuponlar
          </Link>
          <Link
            href="/admin/dropshipping"
            className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
          >
            XML Dropshipping
          </Link>
        </nav>
        <div className="mt-auto pt-8">
          <p className="text-sm text-muted-foreground">
            {session?.user?.email}
          </p>
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Siteye Dön
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
