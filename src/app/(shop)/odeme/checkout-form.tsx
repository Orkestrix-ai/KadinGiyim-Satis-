"use client"

import { useRouter } from "next/navigation"
import { Copy, CreditCard } from "lucide-react"

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

  function Input({ id, name, placeholder, required, className }: {
    id: string; name: string; placeholder: string; required?: boolean; className?: string
  }) {
    return (
      <input
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        className={`px-3.5 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all placeholder:text-muted-foreground/60 ${className ?? ""}`}
      />
    )
  }

  function renderAddressFields(prefix: string, label: string) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">{label}</h3>
          <button
            type="button"
            onClick={() => copyAddress(prefix as "shipping" | "billing")}
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
          >
            <Copy className="size-3" />
            Kopyala
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input id={`${prefix}Name`} name={`${prefix}Name`} placeholder="Ad Soyad" required className="col-span-2" />
          <Input id={`${prefix}Phone`} name={`${prefix}Phone`} placeholder="Telefon" required />
          <Input id={`${prefix}City`} name={`${prefix}City`} placeholder="İl" required />
          <Input id={`${prefix}District`} name={`${prefix}District`} placeholder="İlçe" required />
          <Input id={`${prefix}Address`} name={`${prefix}Address`} placeholder="Adres" required className="col-span-2" />
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {addresses.length > 0 && (
        <div className="bg-muted/30 rounded-2xl p-5">
          <h3 className="font-medium mb-3 text-sm">Kayıtlı Adresler</h3>
          <div className="space-y-2">
            {addresses.map((addr) => (
              <label key={addr.id} className="flex items-start gap-3 border rounded-xl p-4 cursor-pointer hover:bg-background transition-colors has-checked:border-primary has-checked:bg-primary/5">
                <input type="radio" name="addressId" value={addr.id} className="mt-0.5 accent-primary" />
                <div className="text-sm">
                  <p className="font-medium">{addr.title}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{addr.fullAddress}, {addr.district}/{addr.city}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {renderAddressFields("shipping", "Teslimat Adresi")}
        {renderAddressFields("billing", "Fatura Adresi")}
      </div>

      <button
        type="submit"
        className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] cursor-pointer inline-flex items-center justify-center gap-2 text-base"
      >
        <CreditCard className="size-4" />
        Siparişi Tamamla
      </button>
    </form>
  )
}