import { getDropshippers } from "@/lib/actions/dropshipping"
import Link from "next/link"

export default async function SuppliersPage() {
  const dropshippers = await getDropshippers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tedarikçiler</h1>
        <Link href="/admin/dropshipping/suppliers/new" className="inline-flex items-center px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-black/80">
          + Yeni Tedarikçi
        </Link>
      </div>

      {dropshippers.length === 0 ? (
        <div className="border rounded-xl p-8 text-center text-muted-foreground">
          Henüz tedarikçi eklenmemiş. XML besleme URL&apos;niz ile ilk tedarikçinizi ekleyin.
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Tedarikçi</th>
                <th className="text-left p-3 font-medium">Durum</th>
                <th className="text-left p-3 font-medium">Ürün Sayısı</th>
                <th className="text-left p-3 font-medium">Sipariş Sayısı</th>
                <th className="text-left p-3 font-medium">Eklenme</th>
              </tr>
            </thead>
            <tbody>
              {dropshippers.map((d) => (
                <tr key={d.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-3">
                    <Link href={`/admin/dropshipping/suppliers/${d.id}`} className="font-medium hover:underline">
                      {d.name}
                    </Link>
                    <p className="text-xs text-muted-foreground truncate max-w-md">{d.xmlFeedUrl}</p>
                  </td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${d.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {d.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="p-3">{d._count.productMappings}</td>
                  <td className="p-3">{d._count.orderRecords}</td>
                  <td className="p-3">{d.createdAt.toLocaleDateString("tr-TR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
