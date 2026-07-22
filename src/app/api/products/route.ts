import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, variants: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Ürünler alınırken hata oluştu" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { name, slug, description, price, categoryId, variants } = await req.json()

    const product = await prisma.product.create({
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
    return NextResponse.json({ error: "Ürün eklenirken hata oluştu" }, { status: 500 })
  }
}
