import { getDropshippers, getDropshipperOrders, getUnforwardedOrders } from "@/lib/actions/dropshipping"
import Link from "next/link"

export default async function DropshippingDashboard() {
  const [dropshippers, recentOrders, unforwarded] = await Promise.all([
    getDropshippers(),
    getDropshipperOrders(),
    getUnforwardedOrders(),
  ])

  const totalMappings = dropshippers.reduce((a, b) => a + b._count.productMappings, 0)
  const totalForwarded = dropshippers.reduce((a, b) => a + b._count.orderRecords, 0)
  const failedOrders = recentOrders.filter((o) => o.status === "FAILED").length
  const pendingForward = unforwarded.length

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">XML Dropshipping</h1>
        <Link
          href="/admin/dropshipping/suppliers/new"
          className="inline-flex items-center px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-black/80"
        >
          + Yeni Tedarikçi
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Tedarikçi</p>
          <p className="text-2xl font-bold mt-1">{dropshippers.length}</p>
        </div>
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Eşlenen Ürün</p>
          <p className="text-2xl font-bold mt-1">{totalMappings}</p>
        </div>
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">İletilen Sipariş</p>
          <p className="text-2xl font-bold mt-1">{totalForwarded}</p>
        </div>
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">İletilmeyi Bekleyen</p>
          <p className="text-2xl font-bold mt-1">{pendingForward}</p>
        </div>
      </div>

      {dropshippers.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Tedarikçiler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dropshippers.map((d) => (
              <Link
                key={d.id}
                href={`/admin/dropshipping/suppliers/${d.id}`}
                className="rounded-xl border p-5 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{d.name}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${d.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {d.isActive ? "Aktif" : "Pasif"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{d.xmlFeedUrl}</p>
                <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                  <span>{d._count.productMappings} ürün</span>
                  <span>{d._count.orderRecords} sipariş</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {unforwarded.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">
            Tedarikçiye İletilmeyi Bekleyen Siparişler ({pendingForward})
          </h2>
          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Sipariş No</th>
                  <th className="text-left p-3 font-medium">Müşteri</th>
                  <th className="text-left p-3 font-medium">Tutar</th>
                  <th className="text-left p-3 font-medium">Tarih</th>
                  <th className="text-left p-3 font-medium">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {unforwarded.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="p-3 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                    <td className="p-3">{order.user.name ?? order.user.email}</td>
                    <td className="p-3">{Number(order.total).toFixed(2)} TL</td>
                    <td className="p-3">{order.createdAt.toLocaleDateString("tr-TR")}</td>
                    <td className="p-3">
                      <form action={async () => {
                        "use server"
                        const d = await getDropshippers()
                        const { forwardOrderToDropshipper } = await import("@/lib/actions/dropshipping")
                        for (const dropshipper of d) {
                          try { await forwardOrderToDropshipper(dropshipper.id, order.id) } catch { }
                        }
                      }}>
                        <button type="submit" className="text-xs px-3 py-1.5 bg-black text-white rounded-md hover:bg-black/80">
                          Tedarikçiye İlet
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {failedOrders > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h2 className="font-semibold text-red-800">Başarısız İletimler ({failedOrders})</h2>
          <div className="mt-3 space-y-2">
            {recentOrders.filter((o) => o.status === "FAILED").slice(0, 5).map((o) => (
              <div key={o.id} className="text-sm text-red-700">
                <span className="font-mono">{o.id.slice(0, 8)}</span> — {o.dropshipper.name}: {o.errorMessage?.slice(0, 100)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
