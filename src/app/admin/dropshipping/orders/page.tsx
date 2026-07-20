import { getDropshipperOrders } from "@/lib/actions/dropshipping"
import Link from "next/link"

export default async function DropshippingOrdersPage() {
  const orders = await getDropshipperOrders()

  const statusLabels: Record<string, string> = {
    PENDING: "Bekliyor",
    SENT: "Gönderildi",
    CONFIRMED: "İletildi",
    FAILED: "Hata",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">İletilen Siparişler</h1>
        <Link href="/admin/dropshipping" className="text-sm text-muted-foreground hover:text-foreground">← Dropshipping Dashboard</Link>
      </div>

      {orders.length === 0 ? (
        <div className="border rounded-xl p-8 text-center text-muted-foreground">Henüz tedarikçiye iletilen sipariş yok.</div>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Sipariş</th>
                <th className="text-left p-3 font-medium">Tedarikçi</th>
                <th className="text-left p-3 font-medium">Sipariş Tutarı</th>
                <th className="text-left p-3 font-medium">Tedarikçi Sipariş No</th>
                <th className="text-left p-3 font-medium">Durum</th>
                <th className="text-left p-3 font-medium">Tarih</th>
                <th className="text-left p-3 font-medium">Hata</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="p-3"><Link href={`/admin/orders/${o.orderId}`} className="font-mono text-xs hover:underline">{o.orderId.slice(0, 8)}...</Link></td>
                  <td className="p-3">{o.dropshipper.name}</td>
                  <td className="p-3">{o.order.total ? `${Number(o.order.total).toFixed(2)} TL` : "-"}</td>
                  <td className="p-3 font-mono text-xs">{o.supplierOrderId ?? "-"}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${o.status === "CONFIRMED" ? "bg-green-100 text-green-700" : o.status === "FAILED" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {statusLabels[o.status] ?? o.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{o.createdAt.toLocaleDateString("tr-TR")}</td>
                  <td className="p-3 text-red-600 text-xs max-w-[150px] truncate">{o.errorMessage ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
