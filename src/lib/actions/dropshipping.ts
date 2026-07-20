"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createDropshipper(formData: FormData) {
  const name = formData.get("name") as string
  const xmlFeedUrl = formData.get("xmlFeedUrl") as string
  const orderEndpoint = formData.get("orderEndpoint") as string || null
  const apiKey = formData.get("apiKey") as string || null
  const apiPassword = formData.get("apiPassword") as string || null

  await prisma.dropshipper.create({
    data: { name, xmlFeedUrl, orderEndpoint, apiKey, apiPassword },
  })

  revalidatePath("/admin/dropshipping")
}

export async function updateDropshipper(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const xmlFeedUrl = formData.get("xmlFeedUrl") as string
  const orderEndpoint = formData.get("orderEndpoint") as string || null
  const apiKey = formData.get("apiKey") as string || null
  const apiPassword = formData.get("apiPassword") as string || null

  await prisma.dropshipper.update({
    where: { id },
    data: { name, xmlFeedUrl, orderEndpoint, apiKey, apiPassword },
  })

  revalidatePath("/admin/dropshipping")
}

export async function deleteDropshipper(id: string) {
  await prisma.dropshipper.delete({ where: { id } })
  revalidatePath("/admin/dropshipping")
}

type DropshipperWithRelations = Awaited<ReturnType<typeof getDropshipper>>

export async function getDropshippers() {
  return prisma.dropshipper.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { productMappings: true, orderRecords: true } },
    },
  })
}

export async function getDropshipper(id: string) {
  return prisma.dropshipper.findUnique({
    where: { id },
    include: {
      _count: { select: { productMappings: true, orderRecords: true } },
      productMappings: {
        include: { product: { select: { id: true, name: true, slug: true, price: true } } },
        orderBy: { lastSyncAt: "desc" },
      },
      orderRecords: {
        orderBy: { createdAt: "desc" },
      },
    },
  })
}

export async function getDropshipperOrders(dropshipperId?: string) {
  const where = dropshipperId ? { dropshipperId } : {}
  return prisma.dropshipperOrder.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      dropshipper: { select: { name: true } },
      order: { select: { id: true, total: true, status: true } },
    },
  })
}

export async function getUnforwardedOrders() {
  const forwardedOrderIds = await prisma.dropshipperOrder.findMany({
    select: { orderId: true },
    distinct: ["orderId"],
  })
  const forwardedSet = new Set(forwardedOrderIds.map((o) => o.orderId))

  const unforwardedOrders = await prisma.order.findMany({
    where: {
      status: { in: ["PENDING", "PROCESSING"] },
      items: { some: { variant: { product: { mappings: { some: {} } } } } },
    },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: { variant: { select: { productId: true } } },
      },
    },
    orderBy: { createdAt: "asc" },
  })

  return unforwardedOrders.filter((o) => !forwardedSet.has(o.id))
}

export async function importDropshipperProducts(dropshipperId: string) {
  const dropshipper = await prisma.dropshipper.findUnique({
    where: { id: dropshipperId },
  })
  if (!dropshipper) return { imported: 0, skipped: 0, total: 0 }

  try {
    const response = await fetch(dropshipper.xmlFeedUrl, {
      signal: AbortSignal.timeout(30000),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const xmlText = await response.text()
    const products = parseXmlProducts(xmlText)

    let imported = 0
    let skipped = 0

    for (const item of products) {
      const existing = await prisma.product.findFirst({
        where: { slug: item.slug },
      })

      if (!existing) {
        const category = await prisma.category.findFirst({ orderBy: { name: "asc" } })
        const product = await prisma.product.create({
          data: {
            name: item.name,
            slug: item.slug,
            description: item.description,
            price: item.price,
            categoryId: category?.id ?? "",
            images: item.images,
            variants: {
              create: [{
                size: item.size ?? "Standart",
                color: item.color ?? "Standart",
                sku: item.sku,
                stock: item.stock,
              }],
            },
          },
        })

        await prisma.dropshipperProduct.create({
          data: {
            dropshipperId,
            productId: product.id,
            supplierProductId: item.supplierProductId,
            supplierPrice: item.supplierPrice,
            lastSyncAt: new Date(),
          },
        })
        imported++
      } else {
        const existingMapping = await prisma.dropshipperProduct.findUnique({
          where: { dropshipperId_supplierProductId: { dropshipperId, supplierProductId: item.supplierProductId } },
        })

        if (!existingMapping) {
          await prisma.dropshipperProduct.create({
            data: {
              dropshipperId,
              productId: existing.id,
              supplierProductId: item.supplierProductId,
              supplierPrice: item.supplierPrice,
              lastSyncAt: new Date(),
            },
          })
          imported++
        } else {
          await prisma.dropshipperProduct.update({
            where: { id: existingMapping.id },
            data: { supplierPrice: item.supplierPrice, lastSyncAt: new Date() },
          })
          skipped++
        }
      }
    }

    revalidatePath("/admin/dropshipping")
    return { imported, skipped, total: products.length }
  } catch {
    return { imported: 0, skipped: 0, total: 0 }
  }
}

export async function forwardOrderToDropshipper(dropshipperId: string, orderId: string) {
  const dropshipper = await prisma.dropshipper.findUnique({
    where: { id: dropshipperId },
  })
  if (!dropshipper) {
    return { status: "FAILED" as const, supplierOrderId: null, errorMessage: "Tedarikçi bulunamadı" }
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { variant: { include: { product: true } } } },
      },
    })
    if (!order) {
      return { status: "FAILED" as const, supplierOrderId: null, errorMessage: "Sipariş bulunamadı" }
    }

    let supplierOrderId: string | null = null
    let errorMessage: string | null = null
    let status = "SENT"

    if (dropshipper.orderEndpoint) {
      try {
        const body = {
          orderId: order.id,
          total: Number(order.total),
          shipping: {
            name: order.shippingName,
            phone: order.shippingPhone,
            city: order.shippingCity,
            district: order.shippingDistrict,
            address: order.shippingAddress,
          },
          items: order.items.map((item) => ({
            sku: item.variant.sku,
            productName: item.variant.product.name,
            size: item.variant.size,
            color: item.variant.color,
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
          })),
        }
        const res = await fetch(dropshipper.orderEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(dropshipper.apiKey ? { "X-API-Key": dropshipper.apiKey } : {}),
            ...(dropshipper.apiPassword ? { "X-API-Password": dropshipper.apiPassword } : {}),
          },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(15000),
        })
        if (res.ok) {
          const data = await res.json().catch(() => ({}))
          supplierOrderId = data?.orderId ?? data?.id ?? null
          status = "CONFIRMED"
        } else {
          errorMessage = `HTTP ${res.status}: ${await res.text().catch(() => "Bilinmeyen hata")}`
          status = "FAILED"
        }
      } catch (err) {
        errorMessage = err instanceof Error ? err.message : "Bağlantı hatası"
        status = "FAILED"
      }
    }

    await prisma.dropshipperOrder.create({
      data: {
        dropshipperId,
        orderId,
        supplierOrderId,
        status,
        errorMessage,
        rawRequest: JSON.stringify(order),
      },
    })

    revalidatePath("/admin/dropshipping")
    return { status: status as "SENT" | "CONFIRMED" | "FAILED", supplierOrderId, errorMessage }
  } catch (err) {
    return {
      status: "FAILED" as const,
      supplierOrderId: null,
      errorMessage: err instanceof Error ? err.message : "Bilinmeyen hata",
    }
  }
}

function parseXmlProducts(xmlText: string) {
  const items: Array<{
    name: string; slug: string; description: string; price: number
    sku: string; stock: number; size?: string; color?: string
    images: string[]; supplierProductId: string; supplierPrice?: number
  }> = []

  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  let match: RegExpExecArray | null

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const block = match[1]
    const getTag = (tag: string) => {
      const m = new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, "i").exec(block)
      return m ? m[1].trim() : ""
    }

    const name = getTag("name") || getTag("title") || getTag("urunadi")
    const id = getTag("id") || getTag("productId") || getTag("urunid")
    if (!name || !id) continue

    const price = parseFloat(getTag("price") || getTag("fiyat") || "0")
    const stock = parseInt(getTag("stock") || getTag("stok") || "0", 10)

    items.push({
      name,
      slug: getTag("slug") || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
      description: getTag("description") || getTag("aciklama") || "",
      price: isNaN(price) ? 0 : price,
      sku: getTag("sku") || getTag("barkod") || id,
      stock: isNaN(stock) ? 0 : stock,
      size: getTag("size") || getTag("beden") || undefined,
      color: getTag("color") || getTag("renk") || undefined,
      images: [getTag("image") || getTag("gorsel") || getTag("image1") || ""].filter(Boolean),
      supplierProductId: id,
      supplierPrice: isNaN(price) ? undefined : price,
    })
  }

  return items
}


