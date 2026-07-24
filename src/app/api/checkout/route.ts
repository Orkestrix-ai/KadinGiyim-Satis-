import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { createPaymentCheckout } from "@/lib/payment/service"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 })
  }

  const storeId = Number(process.env.LEMONSQUEEZY_STORE_ID)
  if (!storeId) {
    return NextResponse.json({ error: "Ödeme servisi yapılandırılmamış" }, { status: 500 })
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

  const centsTotal = Math.round(Number(total) * 100)

  const variantsResponse = await fetch("https://api.lemonsqueezy.com/v1/variants", {
    headers: {
      Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      Accept: "application/vnd.api+json",
    },
  })
  const variantsData = await variantsResponse.json()
  const variantId = variantsData?.data?.[0]?.id
  if (!variantId) {
    return NextResponse.json({ error: "LemonSqueezy varyantı bulunamadı" }, { status: 500 })
  }

  const result = await createPaymentCheckout({
    storeId,
    variantId: Number(variantId),
    customPrice: centsTotal,
    orderId: order.id,
    email: session.user.email ?? "",
    name: session.user.name ?? shippingName,
    redirectUrl: `${process.env.AUTH_URL ?? "http://localhost:3000"}/siparis-tamam?id=${order.id}`,
  })

  if (!result.success) {
    return NextResponse.json({ error: result.error ?? "Checkout oluşturulamadı" }, { status: 500 })
  }

  return NextResponse.json({ url: result.url, orderId: order.id })
}
