import { prisma } from "@/lib/db"
import { CouponForm } from "./coupon-form"
import { formatPrice } from "@/lib/utils"

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Kuponlar</h1>

      <CouponForm />

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Kod</th>
              <th className="text-left p-3 font-medium">İndirim</th>
              <th className="text-left p-3 font-medium">Min. Sepet</th>
              <th className="text-left p-3 font-medium">Kullanım</th>
              <th className="text-left p-3 font-medium">Bitiş</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  Henüz kupon yok.
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id} className="border-b last:border-0">
                  <td className="p-3 font-mono font-medium">{coupon.code}</td>
                  <td className="p-3">
                    {coupon.discountType === "PERCENTAGE"
                      ? `%${Number(coupon.discountValue)}`
                      : formatPrice(Number(coupon.discountValue))}
                  </td>
                  <td className="p-3">
                    {coupon.minAmount ? formatPrice(Number(coupon.minAmount)) : "—"}
                  </td>
                  <td className="p-3">
                    {coupon.usedCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                  </td>
                  <td className="p-3">
                    {coupon.expiresAt
                      ? coupon.expiresAt.toLocaleDateString("tr-TR")
                      : "Süresiz"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
