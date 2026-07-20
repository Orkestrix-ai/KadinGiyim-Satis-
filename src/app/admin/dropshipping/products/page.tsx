import { getDropshippers, importDropshipperProducts } from "@/lib/actions/dropshipping"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DropshippingProductsPage() {
  const dropshippers = await getDropshippers()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">XML Ürün İçe Aktarma</h1>

      {dropshippers.length === 0 ? (
        <div className="border rounded-xl p-8 text-center text-muted-foreground">
          Önce bir tedarikçi ekleyin, ardından XML beslemesindeki ürünleri içe aktarabilirsiniz.
          <br />
          <Link href="/admin/dropshipping/suppliers/new" className="text-black font-medium underline mt-2 inline-block">Yeni Tedarikçi Ekle</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {dropshippers.map((d) => (
            <div key={d.id} className="rounded-xl border p-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{d.name}</h3>
                <p className="text-sm text-muted-foreground">{d._count.productMappings} ürün eşlenmiş</p>
                <p className="text-xs text-muted-foreground truncate max-w-lg">{d.xmlFeedUrl}</p>
              </div>
              <div className="flex gap-2">
                <form action={async () => {
                  "use server"
                  await importDropshipperProducts(d.id)
                  redirect("/admin/dropshipping/products")
                }}>
                  <button type="submit" className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-black/80">XML&apos;den İçe Aktar / Güncelle</button>
                </form>
                <Link href={`/admin/dropshipping/suppliers/${d.id}`} className="px-4 py-2 border text-sm rounded-lg hover:bg-muted/50 inline-flex items-center">Detay</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
