import { prisma } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import { statusLabels, statusColors, formatDate } from "@/lib/admin-constants"
import Link from "next/link"

export default async function AdminDashboard() {
  const now = new Date()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [productCount, orderCount, userCount, pendingOrders, thisMonthOrders, categoryCount, lowStockVariants] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.findMany({
        where: { createdAt: { gte: thisMonth } },
        select: { total: true },
      }),
      prisma.category.count(),
      prisma.productVariant.count({ where: { stock: { lte: 5 }, NOT: { stock: 0 } } }),
    ])

  const monthlyRevenue = thisMonthOrders.reduce((sum, o) => sum + Number(o.total), 0)

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  })

  const topProducts = await prisma.orderItem.groupBy({
    by: ["variantId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  })

  const topVariantIds = topProducts.map((t) => t.variantId)
  const topVariants =
    topVariantIds.length > 0
      ? await prisma.productVariant.findMany({
          where: { id: { in: topVariantIds } },
          include: { product: { select: { name: true } } },
        })
      : []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {now.toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Toplam Ürün"
          value={productCount}
          sub={`${categoryCount} kategori`}
          href="/admin/products"
        />
        <StatCard
          label="Toplam Sipariş"
          value={orderCount}
          sub={`${pendingOrders} bekleyen`}
          href="/admin/orders"
          highlight={pendingOrders > 0}
        />
        <StatCard
          label="Bu Ay Gelir"
          value={formatPrice(monthlyRevenue)}
          sub={`${thisMonthOrders.length} sipariş`}
        />
        <StatCard
          label="Kullanıcı"
          value={userCount}
          sub={`${lowStockVariants > 0 ? `${lowStockVariants} az stok` : ""}`}
          href="/admin/kullanicilar"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">Son Siparişler</h2>
            <Link href="/admin/orders" className="text-xs text-primary hover:underline">
              Tümünü Gör
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground text-center">Henüz sipariş yok.</p>
          ) : (
            <div className="divide-y">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{order.user.name ?? order.user.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(Number(order.total))}</p>
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                        statusColors[order.status] ?? "bg-muted"
                      }`}
                    >
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border rounded-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">Çok Satanlar</h2>
          </div>
          {topVariants.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground text-center">Henüz sipariş verisi yok.</p>
          ) : (
            <div className="divide-y">
              {topVariants.map((v) => {
                const item = topProducts.find((t) => t.variantId === v.id)
                return (
                  <div key={v.id} className="flex items-center justify-between p-4 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{v.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {v.size} / {v.color}
                      </p>
                    </div>
                    <span className="font-medium text-primary">{item?._sum.quantity ?? 0} adet</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  sub,
  href,
  highlight,
}: {
  label: string
  value: string | number
  sub?: string
  href?: string
  highlight?: boolean
}) {
  const inner = (
    <>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </>
  )

  return href ? (
    <Link
      href={href}
      className={`rounded-xl border p-5 hover:bg-muted/30 transition-colors ${
        highlight ? "border-yellow-200 bg-yellow-50/50" : ""
      }`}
    >
      {inner}
    </Link>
  ) : (
    <div className="rounded-xl border p-5">{inner}</div>
  )
}
