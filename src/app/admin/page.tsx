import { prisma } from "@/lib/db"

export default async function AdminDashboard() {
  const [productCount, orderCount, userCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
  ])

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  })

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">Toplam Ürün</p>
          <p className="text-3xl font-bold mt-1">{productCount}</p>
        </div>
        <div className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">Toplam Sipariş</p>
          <p className="text-3xl font-bold mt-1">{orderCount}</p>
        </div>
        <div className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">Kayıtlı Kullanıcı</p>
          <p className="text-3xl font-bold mt-1">{userCount}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Son Siparişler</h2>
        <div className="border rounded-xl overflow-hidden">
          {recentOrders.length === 0 ? (
            <p className="p-6 text-muted-foreground">Henüz sipariş yok.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Müşteri</th>
                  <th className="text-left p-3 font-medium">Tutar</th>
                  <th className="text-left p-3 font-medium">Durum</th>
                  <th className="text-left p-3 font-medium">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="p-3">{order.user.name ?? order.user.email}</td>
                    <td className="p-3">{Number(order.total).toFixed(2)} TL</td>
                    <td className="p-3">{order.status}</td>
                    <td className="p-3">{order.createdAt.toLocaleDateString("tr-TR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
