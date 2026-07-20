import { prisma } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import { statusLabels, statusColors, formatDate } from "@/lib/admin-constants"
import { OrderStatusUpdate } from "./order-status-update"
import Link from "next/link"

const PAGE_SIZE = 20

export default async function AdminOrdersPage(props: {
  searchParams?: Promise<{ status?: string; q?: string; page?: string }>
}) {
  const searchParams = await props.searchParams
  const filterStatus = searchParams?.status ?? ""
  const q = searchParams?.q?.toLowerCase() ?? ""
  const page = Math.max(1, parseInt(searchParams?.page ?? "1", 10) || 1)

  const where: Record<string, unknown> = {}
  if (filterStatus) where.status = filterStatus
  if (q) {
    where.OR = [
      { user: { name: { contains: q, mode: "insensitive" as const } } },
      { user: { email: { contains: q, mode: "insensitive" as const } } },
    ]
  }

  const [allOrders, totalCount, statusCountsRaw] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ])

  const statusCounts = statusCountsRaw.reduce(
    (acc, s) => { acc[s.status] = s._count.status; return acc },
    {} as Record<string, number>
  )
  const orderTotal = Object.values(statusCounts).reduce((a, b) => a + b, 0)

  const tabs = [
    { label: "Tümü", value: "", count: orderTotal },
    { label: "Bekliyor", value: "PENDING", count: statusCounts.PENDING ?? 0 },
    { label: "Hazırlanıyor", value: "PROCESSING", count: statusCounts.PROCESSING ?? 0 },
    { label: "Kargoda", value: "SHIPPED", count: statusCounts.SHIPPED ?? 0 },
    { label: "Teslim Edildi", value: "DELIVERED", count: statusCounts.DELIVERED ?? 0 },
    { label: "İptal", value: "CANCELLED", count: statusCounts.CANCELLED ?? 0 },
  ]

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Siparişler</h1>
        <form method="GET" className="flex gap-2">
          {filterStatus && <input type="hidden" name="status" value={filterStatus} />}
          <input
            name="q"
            defaultValue={q}
            placeholder="Müşteri ara..."
            className="w-48 px-3 py-2 border rounded-lg text-sm"
          />
          <button type="submit" className="px-3 py-2 border rounded-lg text-sm hover:bg-muted">
            Ara
          </button>
        </form>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value ? `/admin/orders?status=${tab.value}` : "/admin/orders"}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filterStatus === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}{" "}
            <span
              className={`text-xs ml-1 ${
                filterStatus === tab.value ? "opacity-70" : "text-muted-foreground"
              }`}
            >
              ({tab.count})
            </span>
          </Link>
        ))}
      </div>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Sipariş No</th>
              <th className="text-left p-3 font-medium">Müşteri</th>
              <th className="text-left p-3 font-medium">Tutar</th>
              <th className="text-left p-3 font-medium">Durum</th>
              <th className="text-left p-3 font-medium">Tarih</th>
              <th className="text-left p-3 font-medium">Kargo</th>
              <th className="text-right p-3 font-medium">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-muted-foreground">
                  {q || filterStatus
                    ? "Filtreye uygun sipariş bulunamadı."
                    : "Henüz sipariş yok."}
                </td>
              </tr>
            ) : (
              allOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-0 group">
                  <td className="p-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-mono text-xs text-primary hover:underline"
                    >
                      {order.id.slice(0, 8)}...
                    </Link>
                  </td>
                  <td className="p-3">{order.user.name ?? order.user.email}</td>
                  <td className="p-3">{formatPrice(Number(order.total))}</td>
                  <td className="p-3">
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                        statusColors[order.status] ?? "bg-muted"
                      }`}
                    >
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {order.cargoCode ?? "—"}
                  </td>
                  <td className="p-3 text-right">
                    <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            {totalCount} siparişten {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalCount)} gösteriliyor
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/orders?${new URLSearchParams({ status: filterStatus, q, page: String(page - 1) })}`}
                className="px-3 py-1.5 border rounded-lg hover:bg-muted"
              >
                ← Önceki
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/orders?${new URLSearchParams({ status: filterStatus, q, page: String(page + 1) })}`}
                className="px-3 py-1.5 border rounded-lg hover:bg-muted"
              >
                Sonraki →
              </Link>
            )}
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          {allOrders.length} / {totalCount} sipariş gösteriliyor
        </p>
      )}
    </div>
  )
}
