import { getDropshipper, updateDropshipper, deleteDropshipper, importDropshipperProducts } from "@/lib/actions/dropshipping"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"

export default async function SupplierDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const dropshipper = await getDropshipper(id)
  if (!dropshipper) notFound()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/dropshipping/suppliers" className="text-sm text-muted-foreground hover:text-foreground">← Tedarikçiler</Link>
          <h1 className="text-2xl font-bold mt-1">{dropshipper.name}</h1>
        </div>
        <div className="flex gap-2">
          <form action={async () => {
            "use server"
            await importDropshipperProducts(id)
            redirect(`/admin/dropshipping/suppliers/${id}`)
          }}>
            <button type="submit" className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-black/80">XML&apos;den İçe Aktar</button>
          </form>
          <form action={async () => {
            "use server"
            await deleteDropshipper(id)
            redirect("/admin/dropshipping/suppliers")
          }}>
            <button type="submit" className="px-4 py-2 border border-red-200 text-red-600 text-sm rounded-lg hover:bg-red-50">Sil</button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Durum</p>
          <span className={`text-sm font-medium mt-1 inline-block px-2 py-0.5 rounded-full ${dropshipper.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {dropshipper.isActive ? "Aktif" : "Pasif"}
          </span>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Eşlenen Ürün</p>
          <p className="text-xl font-bold mt-1">{dropshipper._count.productMappings}</p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">İletilen Sipariş</p>
          <p className="text-xl font-bold mt-1">{dropshipper._count.orderRecords}</p>
        </div>
      </div>

      <div className="rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Tedarikçi Bilgileri</h2>
        <form action={async (formData: FormData) => {
          "use server"
          await updateDropshipper(id, formData)
          redirect(`/admin/dropshipping/suppliers/${id}`)
        }} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tedarikçi Adı</label>
            <input name="name" defaultValue={dropshipper.name} required className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">XML Besleme URL&apos;si</label>
            <input name="xmlFeedUrl" type="url" defaultValue={dropshipper.xmlFeedUrl} required className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Sipariş Uç Noktası</label>
            <input name="orderEndpoint" type="url" defaultValue={dropshipper.orderEndpoint ?? ""} className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">API Anahtarı</label>
              <input name="apiKey" defaultValue={dropshipper.apiKey ?? ""} className="w-full rounded-lg border px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">API Şifresi</label>
              <input name="apiPassword" type="password" defaultValue={dropshipper.apiPassword ?? ""} className="w-full rounded-lg border px-3 py-2 text-sm" />
            </div>
          </div>
          <button type="submit" className="px-6 py-2 bg-black text-white text-sm rounded-lg hover:bg-black/80">Güncelle</button>
        </form>
      </div>

      {dropshipper.productMappings.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3">Eşlenen Ürünler ({dropshipper.productMappings.length})</h2>
          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Ürün</th>
                  <th className="text-left p-3 font-medium">Tedarikçi Kodu</th>
                  <th className="text-left p-3 font-medium">Tedarikçi Fiyatı</th>
                  <th className="text-left p-3 font-medium">Son Senkronizasyon</th>
                </tr>
              </thead>
              <tbody>
                {dropshipper.productMappings.map((m) => (
                  <tr key={m.id} className="border-b last:border-0">
                    <td className="p-3">{m.product.name}</td>
                    <td className="p-3 font-mono text-xs">{m.supplierProductId}</td>
                    <td className="p-3">{m.supplierPrice ? `${Number(m.supplierPrice).toFixed(2)} TL` : "-"}</td>
                    <td className="p-3 text-muted-foreground">
                      {m.lastSyncAt ? m.lastSyncAt.toLocaleDateString("tr-TR") + " " + m.lastSyncAt.toLocaleTimeString("tr-TR") : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {dropshipper.orderRecords.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3">Son Sipariş İletimleri</h2>
          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Sipariş</th>
                  <th className="text-left p-3 font-medium">Tedarikçi Sipariş No</th>
                  <th className="text-left p-3 font-medium">Durum</th>
                  <th className="text-left p-3 font-medium">Tarih</th>
                  <th className="text-left p-3 font-medium">Hata</th>
                </tr>
              </thead>
              <tbody>
                {dropshipper.orderRecords.map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="p-3 font-mono text-xs">{r.orderId.slice(0, 8)}...</td>
                    <td className="p-3 font-mono text-xs">{r.supplierOrderId ?? "-"}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === "CONFIRMED" ? "bg-green-100 text-green-700" : r.status === "FAILED" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {r.status === "CONFIRMED" ? "İletildi" : r.status === "FAILED" ? "Hata" : r.status === "SENT" ? "Gönderildi" : "Bekliyor"}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{r.createdAt.toLocaleDateString("tr-TR")}</td>
                    <td className="p-3 text-red-600 text-xs max-w-[200px] truncate">{r.errorMessage ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
