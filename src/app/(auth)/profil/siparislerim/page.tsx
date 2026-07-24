import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function MyOrdersPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  const statusLabels: Record<string, string> = {
    PENDING: "Bekliyor",
    PROCESSING: "Hazırlanıyor",
    SHIPPED: "Kargoda",
    DELIVERED: "Teslim Edildi",
    CANCELLED: "İptal Edildi",
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">Nevrak</Link>
          <Link href="/profil" className="text-sm font-medium">Profili</Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Siparişlerim</h1>
        {orders.length === 0 ? (
          <p className="text-muted-foreground">Henüz siparişiniz yok.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {order.createdAt.toLocaleDateString("tr-TR")}
                    </p>
                    <p className="font-semibold">{Number(order.total).toFixed(2)} TL</p>
                  </div>
                  <span className="text-sm px-3 py-1 rounded-full bg-muted">
                    {statusLabels[order.status] ?? order.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Teslimat: {order.shippingName} - {order.shippingCity}
                </p>
                {order.cargoCode && (
                  <p className="text-sm text-muted-foreground">
                    Kargo Takip: {order.cargoCode}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
