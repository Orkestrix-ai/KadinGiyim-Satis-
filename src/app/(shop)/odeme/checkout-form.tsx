"use client"

import { useRouter } from "next/navigation"

interface Address {
  id: string
  title: string
  fullName: string
  phone: string
  city: string
  district: string
  fullAddress: string
}

interface Props {
  addresses: Address[]
  total: number
}

export function CheckoutForm({ addresses, total }: Props) {
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    const body = {
      shippingName: form.get("shippingName"),
      shippingPhone: form.get("shippingPhone"),
      shippingCity: form.get("shippingCity"),
      shippingDistrict: form.get("shippingDistrict"),
      shippingAddress: form.get("shippingAddress"),
      billingName: form.get("billingName"),
      billingPhone: form.get("billingPhone"),
      billingCity: form.get("billingCity"),
      billingDistrict: form.get("billingDistrict"),
      billingAddress: form.get("billingAddress"),
      total,
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      const order = await res.json()
      router.push(`/siparis-tamam?id=${order.id}`)
    }
  }

  function copyAddress(type: "shipping" | "billing") {
    const fields = ["Name", "Phone", "City", "District", "Address"]
    fields.forEach((field) => {
      const source = document.getElementById(`${type}${field}`) as HTMLInputElement
      const target = document.getElementById(`${type === "shipping" ? "billing" : "shipping"}${field}`) as HTMLInputElement
      if (source && target) target.value = source.value
    })
  }

  function renderAddressFields(prefix: string, label: string) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{label}</h3>
          <button
            type="button"
            onClick={() => copyAddress(prefix as "shipping" | "billing")}
            className="text-xs text-primary hover:underline"
          >
            Kopyala
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input
            id={`${prefix}Name`}
            name={`${prefix}Name`}
            placeholder="Ad Soyad"
            required
            className="col-span-2 px-3 py-2 border rounded-lg text-sm"
          />
          <input
            id={`${prefix}Phone`}
            name={`${prefix}Phone`}
            placeholder="Telefon"
            required
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <input
            id={`${prefix}City`}
            name={`${prefix}City`}
            placeholder="İl"
            required
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <input
            id={`${prefix}District`}
            name={`${prefix}District`}
            placeholder="İlçe"
            required
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <input
            id={`${prefix}Address`}
            name={`${prefix}Address`}
            placeholder="Adres"
            required
            className="col-span-2 px-3 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {addresses.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Kayıtlı Adresler</h3>
          <div className="space-y-2">
            {addresses.map((addr) => (
              <label key={addr.id} className="flex items-start gap-3 border rounded-xl p-4 cursor-pointer hover:bg-muted">
                <input type="radio" name="addressId" value={addr.id} />
                <div className="text-sm">
                  <p className="font-medium">{addr.title}</p>
                  <p className="text-muted-foreground">{addr.fullAddress}, {addr.district}/{addr.city}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {renderAddressFields("shipping", "Teslimat Adresi")}
      {renderAddressFields("billing", "Fatura Adresi")}

      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-lg"
      >
        Siparişi Tamamla
      </button>
    </form>
  )
}
