import { prisma } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import { statusLabels, statusColors, formatDateTime } from "@/lib/admin-constants"
import { notFound } from "next/navigation"
import Link from "next/link"
import { OrderStatusUpdate } from "../order-status-update"

export default async function OrderDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: { variant: { include: { product: { select: { name: true } } } } },
      },
    },
  })

  if (!order) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/orders" className="text-sm text-muted-foreground hover:text-foreground">
          ← Siparişler
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sipariş Detayı</h1>
          <p className="font-mono text-xs text-muted-foreground mt-1">{order.id}</p>
        </div>
        <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-xl p-4">
          <h3 className="text-sm font-medium mb-2">Durum</h3>
          <span
            className={`text-sm px-2 py-1 rounded-full ${statusColors[order.status] ?? "bg-muted"}`}
          >
            {statusLabels[order.status] ?? order.status}
          </span>
        </div>
        <div className="border rounded-xl p-4">
          <h3 className="text-sm font-medium mb-2">Sipariş Tarihi</h3>
          <p className="text-sm">
            {formatDateTime(order.createdAt)}
          </p>
        </div>
        <div className="border rounded-xl p-4">
          <h3 className="text-sm font-medium mb-2">Kargo</h3>
          <p className="text-sm">{order.cargoCode ? `${order.cargoCompany ?? ""} - ${order.cargoCode}` : "Henüz atanmamış"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-xl p-4">
          <h3 className="font-medium mb-3">Teslimat Adresi</h3>
          <div className="text-sm space-y-1 text-muted-foreground">
            <p className="text-foreground font-medium">{order.shippingName}</p>
            <p>{order.shippingPhone}</p>
            <p>
              {order.shippingAddress}
            </p>
            <p>
              {order.shippingDistrict}/{order.shippingCity}
            </p>
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <h3 className="font-medium mb-3">Fatura Adresi</h3>
          <div className="text-sm space-y-1 text-muted-foreground">
            <p className="text-foreground font-medium">{order.billingName}</p>
            <p>{order.billingPhone}</p>
            <p>{order.billingAddress}</p>
            <p>
              {order.billingDistrict}/{order.billingCity}
            </p>
          </div>
        </div>
      </div>

      <div className="border rounded-xl">
        <div className="p-4 border-b">
          <h3 className="font-medium">Sipariş Kalemleri</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Ürün</th>
              <th className="text-left p-3 font-medium">Varyasyon</th>
              <th className="text-left p-3 font-medium">Adet</th>
              <th className="text-left p-3 font-medium">Birim Fiyat</th>
              <th className="text-right p-3 font-medium">Toplam</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="p-3">{item.variant.product.name}</td>
                <td className="p-3 text-muted-foreground">
                  {item.variant.size} / {item.variant.color}
                </td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">{formatPrice(Number(item.unitPrice))}</td>
                <td className="p-3 text-right font-medium">
                  {formatPrice(Number(item.unitPrice) * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t bg-muted/30">
              <td colSpan={4} className="p-3 text-right font-medium">
                Genel Toplam
              </td>
              <td className="p-3 text-right font-bold">{formatPrice(Number(order.total))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
