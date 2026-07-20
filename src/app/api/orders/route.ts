import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 })
  }

  const { shippingName, shippingPhone, shippingCity, shippingDistrict, shippingAddress, billingName, billingPhone, billingCity, billingDistrict, billingAddress, total } = await req.json()

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { variant: { include: { product: true } } },
      },
    },
  })

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "Sepet boş" }, { status: 400 })
  }

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      total,
      shippingName,
      shippingPhone,
      shippingCity,
      shippingDistrict,
      shippingAddress,
      billingName,
      billingPhone,
      billingCity,
      billingDistrict,
      billingAddress,
      items: {
        create: cart.items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.variant.product.price,
        })),
      },
    },
  })

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })

  return NextResponse.json(order)
}

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(orders)
}
