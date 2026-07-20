"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { orderStatusOptions } from "@/lib/admin-constants"

interface Props {
  orderId: string
  currentStatus: string
}

export function OrderStatusUpdate({ orderId, currentStatus }: Props) {
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)
  const [cargoCode, setCargoCode] = useState("")
  const [showCargoInput, setShowCargoInput] = useState(false)
  const [updating, setUpdating] = useState(false)

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value
    setSelectedStatus(newStatus)
    if (newStatus === "SHIPPED") {
      setShowCargoInput(true)
    } else {
      setShowCargoInput(false)
      await updateStatus(newStatus, "")
    }
  }

  async function handleCargoSubmit() {
    await updateStatus(selectedStatus, cargoCode)
    setShowCargoInput(false)
    setCargoCode("")
  }

  async function updateStatus(status: string, code: string) {
    setUpdating(true)
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, cargoCode: code || null }),
      })
      router.refresh()
    } catch {
      // silently fail; the page shows the original state on next refresh
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedStatus}
        onChange={handleStatusChange}
        disabled={updating}
        className="text-xs px-2 py-1 border rounded-lg disabled:opacity-50"
      >
        {orderStatusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {showCargoInput && (
        <div className="flex items-center gap-1">
          <input
            value={cargoCode}
            onChange={(e) => setCargoCode(e.target.value)}
            placeholder="Kargo takip kodu"
            className="w-32 px-2 py-1 border rounded-lg text-xs"
            autoFocus
          />
          <button
            onClick={handleCargoSubmit}
            className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-lg"
          >
            Kaydet
          </button>
        </div>
      )}
      {updating && <span className="text-xs text-muted-foreground">...</span>}
    </div>
  )
}
