import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { productId, images, description } = await req.json()

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {}

    if (Array.isArray(images) && images.length > 0) {
      updateData.images = [...product.images, ...images]
    }

    if (typeof description === "string") {
      updateData.description = description
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Kaydedilecek veri bulunamadı" }, { status: 400 })
    }

    await prisma.product.update({
      where: { id: productId },
      data: updateData,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
