import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { code, discountType, discountValue, minAmount, usageLimit, expiresAt } = await req.json()

    const existing = await prisma.coupon.findUnique({ where: { code } })
    if (existing) {
      return NextResponse.json({ error: "Bu kod zaten mevcut" }, { status: 400 })
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue,
        minAmount: minAmount || null,
        usageLimit: usageLimit || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })

    return NextResponse.json(coupon)
  } catch {
    return NextResponse.json({ error: "Kupon eklenirken hata oluştu" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")

  if (code) {
    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } })
    if (!coupon) {
      return NextResponse.json({ error: "Kupon bulunamadı" }, { status: 404 })
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json({ error: "Kupon süresi dolmuş" }, { status: 400 })
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "Kupon kullanım limiti dolmuş" }, { status: 400 })
    }
    return NextResponse.json(coupon)
  }

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(coupons)
}
