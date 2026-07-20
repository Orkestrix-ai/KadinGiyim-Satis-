import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">ModaCini</Link>
          <Link href="/" className="text-sm font-medium">Ana Sayfa</Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Profilim</h1>
        <div className="space-y-4">
          <div className="border rounded-xl p-6">
            <p className="text-sm text-muted-foreground">Ad Soyad</p>
            <p className="font-medium">{session.user.name ?? "—"}</p>
          </div>
          <div className="border rounded-xl p-6">
            <p className="text-sm text-muted-foreground">E-posta</p>
            <p className="font-medium">{session.user.email}</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/profil/siparislerim"
              className="flex-1 border rounded-xl p-6 text-center hover:bg-muted transition-colors"
            >
              <p className="font-medium">Siparişlerim</p>
            </Link>
            <Link
              href="/profil/adreslerim"
              className="flex-1 border rounded-xl p-6 text-center hover:bg-muted transition-colors"
            >
              <p className="font-medium">Adreslerim</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
