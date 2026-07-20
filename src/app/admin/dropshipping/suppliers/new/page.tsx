import { createDropshipper } from "@/lib/actions/dropshipping"
import { redirect } from "next/navigation"

export default function NewSupplierPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Yeni Tedarikçi Ekle</h1>

      <form action={async (formData: FormData) => {
        "use server"
        await createDropshipper(formData)
        redirect("/admin/dropshipping/suppliers")
      }} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tedarikçi Adı</label>
          <input name="name" required className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Örn: Örnek Dropshipping" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">XML Besleme URL&apos;si</label>
          <input name="xmlFeedUrl" type="url" required className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="https://www.ornekfirma.com/xml/urunler.xml" />
          <p className="text-xs text-muted-foreground">Ürünleri içeren XML beslemesinin URL&apos;si</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Sipariş Uç Noktası <span className="text-muted-foreground">(opsiyonel)</span></label>
          <input name="orderEndpoint" type="url" className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="https://www.ornekfirma.com/api/siparis" />
          <p className="text-xs text-muted-foreground">Siparişlerin XML olarak iletileceği API adresi</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">API Anahtarı <span className="text-muted-foreground">(opsiyonel)</span></label>
            <input name="apiKey" className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="API anahtarı" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">API Şifresi <span className="text-muted-foreground">(opsiyonel)</span></label>
            <input name="apiPassword" type="password" className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="API şifresi" />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="px-6 py-2 bg-black text-white text-sm rounded-lg hover:bg-black/80">Kaydet</button>
          <a href="/admin/dropshipping/suppliers" className="px-6 py-2 border text-sm rounded-lg hover:bg-muted/50 text-center">İptal</a>
        </div>
      </form>
    </div>
  )
}
