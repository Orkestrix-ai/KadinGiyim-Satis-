import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function MyAddressesPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  })

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">Nevrak</Link>
          <Link href="/profil" className="text-sm font-medium">Profili</Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Adreslerim</h1>
        </div>
        {addresses.length === 0 ? (
          <p className="text-muted-foreground">Henüz adres eklemediniz.</p>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="border rounded-xl p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{addr.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {addr.fullName} - {addr.phone}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {addr.fullAddress}, {addr.district}, {addr.city}
                    </p>
                  </div>
                  {addr.isDefault && (
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      Varsayılan
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
