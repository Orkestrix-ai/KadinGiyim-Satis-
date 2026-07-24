import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"
import {
  testUsers,
  testCategories,
  testProducts,
  testAddresses,
  testCoupons,
  testDropshippers,
} from "./test-data"

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  const prisma = new PrismaClient({ adapter })

  console.log("Seed başladı...")

  const passwordCache = new Map<string, string>()

  async function hashPassword(password: string): Promise<string> {
    const cached = passwordCache.get(password)
    if (cached) return cached
    const hash = await bcrypt.hash(password, 12)
    passwordCache.set(password, hash)
    return hash
  }

  const createdUserIds = new Map<string, string>()

  for (const u of testUsers) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } })
    if (existing) {
      createdUserIds.set(u.email, existing.id)
      continue
    }
    const password = await hashPassword(u.password)
    const user = await prisma.user.create({
      data: { name: u.name, email: u.email, password, role: u.role },
    })
    createdUserIds.set(u.email, user.id)
  }
  console.log(`Kullanıcılar: ${createdUserIds.size} adet`)

  const createdCategorySlugs = new Map<string, string>()

  const rootCategories = testCategories.filter((c) => c.parentSlug === null)
  for (const cat of rootCategories) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } })
    if (existing) {
      createdCategorySlugs.set(cat.slug, existing.id)
      continue
    }
    const created = await prisma.category.create({ data: { name: cat.name, slug: cat.slug } })
    createdCategorySlugs.set(cat.slug, created.id)
  }

  const subCategories = testCategories.filter((c) => c.parentSlug !== null)
  for (const cat of subCategories) {
    const parentId = createdCategorySlugs.get(cat.parentSlug!)
    if (!parentId) continue
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } })
    if (existing) {
      createdCategorySlugs.set(cat.slug, existing.id)
      continue
    }
    const created = await prisma.category.create({
      data: { name: cat.name, slug: cat.slug, parentId },
    })
    createdCategorySlugs.set(cat.slug, created.id)
  }
  console.log(`Kategoriler: ${createdCategorySlugs.size} adet`)

  const createdVariantSkus = new Map<string, string>()
  let productCount = 0
  let variantCount = 0

  for (const p of testProducts) {
    const categoryId = createdCategorySlugs.get(p.categorySlug)
    if (!categoryId) {
      console.warn(`Kategori bulunamadı: ${p.categorySlug}, ürün atlandı: ${p.name}`)
      continue
    }

    const existing = await prisma.product.findUnique({ where: { slug: p.slug } })
    if (existing) {
      productCount++
      for (const v of p.variants) {
        const existingVariant = await prisma.productVariant.findUnique({ where: { sku: v.sku } })
        if (existingVariant) {
          createdVariantSkus.set(v.sku, existingVariant.id)
          variantCount++
        }
      }
      continue
    }

    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        images: p.images,
        categoryId,
        featured: p.featured,
      },
    })
    productCount++

    for (const v of p.variants) {
      const variant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          size: v.size,
          color: v.color,
          sku: v.sku,
          stock: v.stock,
          price: v.price,
        },
      })
      createdVariantSkus.set(v.sku, variant.id)
      variantCount++
    }
  }
  console.log(`Ürünler: ${productCount} adet, Varyantlar: ${variantCount} adet`)

  const createdAddressIds: string[] = []
  for (const addr of testAddresses) {
    const userId = createdUserIds.get(addr.userEmail)
    if (!userId) continue

    const existing = await prisma.address.findFirst({
      where: { userId, title: addr.title, fullAddress: addr.fullAddress },
    })
    if (existing) {
      createdAddressIds.push(existing.id)
      continue
    }

    const address = await prisma.address.create({
      data: {
        userId,
        title: addr.title,
        fullName: addr.fullName,
        phone: addr.phone,
        city: addr.city,
        district: addr.district,
        fullAddress: addr.fullAddress,
        isDefault: addr.isDefault,
      },
    })
    createdAddressIds.push(address.id)
  }
  console.log(`Adresler: ${createdAddressIds.length} adet`)

  for (const coupon of testCoupons) {
    const existing = await prisma.coupon.findUnique({ where: { code: coupon.code } })
    if (!existing) {
      await prisma.coupon.create({ data: coupon })
    }
  }
  console.log(`Kuponlar: ${testCoupons.length} adet`)

  for (const d of testDropshippers) {
    const existing = await prisma.dropshipper.findFirst({
      where: { name: d.name, xmlFeedUrl: d.xmlFeedUrl },
    })
    if (!existing) {
      await prisma.dropshipper.create({ data: d })
    }
  }
  console.log(`Dropshipper'lar: ${testDropshippers.length} adet`)

  const allVariantIds = [...createdVariantSkus.values()]
  const allUserIds = [...createdUserIds.values()]
  const nonAdminUserIds = allUserIds.filter(
    (id) => id !== createdUserIds.get("admin@nevrak.com")
  )

  const testOrders = [
    {
      userEmail: "zeynep@example.com",
      status: "DELIVERED" as const,
      daysAgo: 30,
      items: [
        { sku: "ABY-001-M-SY", qty: 1 },
        { sku: "CNT-001-TB-SY", qty: 1 },
      ],
    },
    {
      userEmail: "zeynep@example.com",
      status: "SHIPPED" as const,
      daysAgo: 10,
      items: [
        { sku: "GUN-001-M-MV", qty: 2 },
        { sku: "PAN-001-M-SY", qty: 1 },
      ],
    },
    {
      userEmail: "ayse@example.com",
      status: "PROCESSING" as const,
      daysAgo: 3,
      items: [
        { sku: "KZK-001-M-KR", qty: 1 },
        { sku: "GOM-001-M-BY", qty: 1 },
        { sku: "ETK-001-M-CD", qty: 1 },
      ],
    },
    {
      userEmail: "ayse@example.com",
      status: "PENDING" as const,
      daysAgo: 1,
      items: [{ sku: "TST-001-M-BY", qty: 3 }],
    },
    {
      userEmail: "elif@example.com",
      status: "CANCELLED" as const,
      daysAgo: 15,
      items: [
        { sku: "MNT-001-M-SY", qty: 1 },
        { sku: "ATK-001-TB-BD", qty: 1 },
      ],
    },
    {
      userEmail: "zeynep@example.com",
      status: "DELIVERED" as const,
      daysAgo: 45,
      items: [{ sku: "ABY-002-M-KR", qty: 1 }],
    },
    {
      userEmail: "elif@example.com",
      status: "DELIVERED" as const,
      daysAgo: 20,
      items: [
        { sku: "TRC-001-M-BJ", qty: 1 },
        { sku: "TK-001-TB-BY", qty: 1 },
      ],
    },
  ]

  const cargoCompanies = ["Yurtiçi Kargo", "MNG Kargo", "Aras Kargo"]

  let orderCount = 0
  for (const o of testOrders) {
    const userId = createdUserIds.get(o.userEmail)
    if (!userId) continue

    const variantDetails: { id: string; price: number }[] = []
    let total = 0

    for (const item of o.items) {
      const variantId = createdVariantSkus.get(item.sku)
      if (!variantId) {
        console.warn(`Varyant bulunamadı: ${item.sku}, sipariş öğesi atlandı`)
        continue
      }
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
        include: { product: { select: { price: true } } },
      })
      if (!variant) continue

      const unitPrice = variant.price ?? variant.product.price
      total += Number(unitPrice) * item.qty
      variantDetails.push({ id: variantId, price: Number(unitPrice) })
    }

    if (variantDetails.length === 0) continue

    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() - o.daysAgo)

    const cargoCompany =
      o.status === "SHIPPED" || o.status === "DELIVERED"
        ? cargoCompanies[Math.floor(Math.random() * cargoCompanies.length)]
        : null
    const cargoCode =
      cargoCompany
        ? `${["YT", "MNG", "ARS"][cargoCompanies.indexOf(cargoCompany)]}${String(Math.floor(Math.random() * 9000000000) + 1000000000)}`
        : null

    const user = await prisma.user.findUnique({ where: { id: userId }, include: { addresses: true } })
    const address = user?.addresses[0]

    const existingOrder = await prisma.order.findFirst({
      where: { userId, createdAt: { gte: new Date(createdAt.getTime() - 60000), lte: new Date(createdAt.getTime() + 60000) } },
    })
    if (existingOrder) continue

    const order = await prisma.order.create({
      data: {
        userId,
        status: o.status,
        total,
        shippingName: address?.fullName ?? user?.name ?? "",
        shippingPhone: address?.phone ?? "05000000000",
        shippingCity: address?.city ?? "İstanbul",
        shippingDistrict: address?.district ?? "Kadıköy",
        shippingAddress: address?.fullAddress ?? "Varsayılan Adres",
        billingName: address?.fullName ?? user?.name ?? "",
        billingPhone: address?.phone ?? "05000000000",
        billingCity: address?.city ?? "İstanbul",
        billingDistrict: address?.district ?? "Kadıköy",
        billingAddress: address?.fullAddress ?? "Varsayılan Adres",
        cargoCode,
        cargoCompany,
        createdAt,
        items: {
          create: variantDetails.map((v) => ({
            variantId: v.id,
            quantity: o.items.find((i) => createdVariantSkus.get(i.sku) === v.id)?.qty ?? 1,
            unitPrice: v.price,
          })),
        },
      },
    })
    orderCount++
  }
  console.log(`Siparişler: ${orderCount} adet`)

  for (const userId of nonAdminUserIds) {
    const existingCart = await prisma.cart.findUnique({ where: { userId } })
    if (!existingCart) {
      const randomVariants = allVariantIds
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 1)

      await prisma.cart.create({
        data: {
          userId,
          items: {
            create: randomVariants.map((variantId) => ({
              variantId,
              quantity: Math.floor(Math.random() * 3) + 1,
            })),
          },
        },
      })
    }
  }
  console.log("Sepetler oluşturuldu.")

  await prisma.$disconnect()
  console.log("Seed tamamlandı!")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
