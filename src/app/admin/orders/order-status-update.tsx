"use client"

import { useRouter } from "next/navigation"

interface Props {
  orderId: string
  currentStatus: string
}

const statusOptions = [
  { value: "PENDING", label: "Bekliyor" },
  { value: "PROCESSING", label: "Hazırlanıyor" },
  { value: "SHIPPED", label: "Kargoda" },
  { value: "DELIVERED", label: "Teslim Edildi" },
  { value: "CANCELLED", label: "İptal Edildi" },
]

export function OrderStatusUpdate({ orderId, currentStatus }: Props) {
  const router = useRouter()

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value
    const cargoCode = prompt("Kargo takip kodu (opsiyonel):")

    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, cargoCode }),
    })
    router.refresh()
  }

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleStatusChange}
      className="text-xs px-2 py-1 border rounded-lg"
    >
      {statusOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
