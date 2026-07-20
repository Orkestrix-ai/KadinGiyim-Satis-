import { prisma } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import { OrderStatusUpdate } from "./order-status-update"

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: { select: { name: true, email: true } } },
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Siparişler</h1>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Sipariş No</th>
              <th className="text-left p-3 font-medium">Müşteri</th>
              <th className="text-left p-3 font-medium">Tutar</th>
              <th className="text-left p-3 font-medium">Durum</th>
              <th className="text-left p-3 font-medium">Tarih</th>
              <th className="text-left p-3 font-medium">Kargo</th>
              <th className="text-right p-3 font-medium">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-muted-foreground">
                  Henüz sipariş yok.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="p-3 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                  <td className="p-3">{order.user.name ?? order.user.email}</td>
                  <td className="p-3">{formatPrice(Number(order.total))}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-muted">
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {order.createdAt.toLocaleDateString("tr-TR")}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {order.cargoCode ?? "—"}
                  </td>
                  <td className="p-3 text-right">
                    <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
