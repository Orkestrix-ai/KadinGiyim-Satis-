import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { name, slug, description, price, categoryId, variants } = await req.json()

    await prisma.productVariant.deleteMany({ where: { productId: id } })

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        price,
        categoryId,
        variants: {
          create: variants?.map((v: { size: string; color: string; sku: string; stock: number }) => ({
            size: v.size,
            color: v.color,
            sku: v.sku,
            stock: v.stock,
          })) ?? [],
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Ürün güncellenirken hata oluştu" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Ürün silinirken hata oluştu" }, { status: 500 })
  }
}
