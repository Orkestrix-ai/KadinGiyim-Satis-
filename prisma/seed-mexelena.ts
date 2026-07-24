import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import bcrypt from "bcryptjs"
import seedData from "../scraped-data/seed-data.json"

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: false },
  })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  console.log("Mexelena seed başladı...")

  // === CATEGORIES ===
  const categoryDefs = [
    { name: "Elbiseler", slug: "elbiseler", parentSlug: null },
    { name: "Elbise", slug: "elbise", parentSlug: "elbiseler" },
    { name: "Üst Giyim", slug: "ust-giyim", parentSlug: null },
    { name: "T-shirt & Bluz", slug: "tshirt-bluz", parentSlug: "ust-giyim" },
    { name: "Gömlek", slug: "gomlek", parentSlug: "ust-giyim" },
    { name: "Kazak & Hırka", slug: "kazak-hirka", parentSlug: "ust-giyim" },
    { name: "İkili Takım", slug: "ikili-takim", parentSlug: "ust-giyim" },
    { name: "Tunik", slug: "tunik", parentSlug: "ust-giyim" },
    { name: "Dış Giyim", slug: "dis-giyim", parentSlug: null },
    { name: "Ceket", slug: "ceket", parentSlug: "dis-giyim" },
    { name: "Mont & Kaban", slug: "mont-kaban", parentSlug: "dis-giyim" },
    { name: "Trençkot", slug: "trenckot", parentSlug: "dis-giyim" },
    { name: "Alt Giyim", slug: "alt-giyim", parentSlug: null },
    { name: "Pantolon", slug: "pantolon", parentSlug: "alt-giyim" },
    { name: "Etek", slug: "etek", parentSlug: "alt-giyim" },
    { name: "Şort & Bermuda", slug: "sort-bermuda", parentSlug: "alt-giyim" },
    { name: "Tayt & Tulum", slug: "tayt", parentSlug: "alt-giyim" },
    { name: "Aksesuar", slug: "aksesuar", parentSlug: null },
    { name: "Çanta", slug: "canta", parentSlug: "aksesuar" },
    { name: "Atkı & Şal", slug: "atki-sal", parentSlug: "aksesuar" },
    { name: "Terlik", slug: "terlik", parentSlug: "aksesuar" },
    { name: "Kemer", slug: "kemer", parentSlug: "aksesuar" },
    { name: "Diğer Aksesuar", slug: "aksesuar-alt", parentSlug: "aksesuar" },
  ]

  const createdCategorySlugs = new Map<string, string>()

  // Create root categories first
  for (const cat of categoryDefs.filter(c => c.parentSlug === null)) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } })
    if (existing) {
      createdCategorySlugs.set(cat.slug, existing.id)
    } else {
      const created = await prisma.category.create({ data: { name: cat.name, slug: cat.slug } })
      createdCategorySlugs.set(cat.slug, created.id)
    }
  }

  // Create subcategories
  for (const cat of categoryDefs.filter(c => c.parentSlug !== null)) {
    const parentId = createdCategorySlugs.get(cat.parentSlug!)
    if (!parentId) continue
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } })
    if (existing) {
      createdCategorySlugs.set(cat.slug, existing.id)
    } else {
      const created = await prisma.category.create({
        data: { name: cat.name, slug: cat.slug, parentId },
      })
      createdCategorySlugs.set(cat.slug, created.id)
    }
  }
  console.log(`Kategoriler: ${createdCategorySlugs.size} adet`)

  // === USERS (keep existing test users) ===
  const passwordCache = new Map<string, string>()
  async function hashPassword(password: string): Promise<string> {
    const cached = passwordCache.get(password)
    if (cached) return cached
    const hash = await bcrypt.hash(password, 12)
    passwordCache.set(password, hash)
    return hash
  }

  const userDefs = [
    { name: "Admin", email: "admin@modacini.com", password: "admin123", role: "ADMIN" as const },
    { name: "Zeynep Yılmaz", email: "zeynep@example.com", password: "test123", role: "USER" as const },
    { name: "Ayşe Demir", email: "ayse@example.com", password: "test123", role: "USER" as const },
    { name: "Elif Kaya", email: "elif@example.com", password: "test123", role: "USER" as const },
  ]

  const createdUserIds = new Map<string, string>()
  for (const u of userDefs) {
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

  // === PRODUCTS ===
  let productCount = 0
  let variantCount = 0
  let skippedCount = 0
  const { products } = seedData

  const excludedSlugs = new Set([
    "erkek-oversize-krem-gomlek-20193bgd19033",
    "erkek-oversize-beyaz-gomlek-20193bgd19005",
    "erkek-rahat-kesim-denim-mavi-pantolon-30073bgd19008",
    "erkek-rahat-kesim-denim-antrasit-pantolon-30073bgd19039",
    "erkek-rahat-kesim-denim-tas-pantolon-30073bgd19501",
    "erkek-rahat-kesim-denim-mavi-pantolon-30074bgd19008",
    "erkek-rahat-kesim-denim-antrasit-pantolon-30074bgd19039",
    "erkek-rahat-kesim-denim-lacivert-pantolon-30074bgd19009",
    "erkek-rahat-kesim-baggy-denim-siyah-pantolon-30075bgd19001",
    "erkek-rahat-kesim-denim-mavi-pantolon-30075bgd19008",
    "erkek-rahat-kesim-denim-lacivert-pantolon-30075bgd19009",
    "erkek-rahat-kesim-baggy-denim-antrasit-pantolon-30075bgd19039",
    "erkek-rahat-kesim-denim-indigo-pantolon-30075bgd19043",
    "erkek-rahat-kesim-baggy-denim-tas-pantolon-30075bgd19501",
    "erkek-rahat-kesim-denim-lacivert-pantolon-30076bgd19009",
    "erkek-rahat-kesim-baggy-denim-antrasit-pantolon-30076bgd19039",
    "erkek-rahat-kesim-baggy-denim-indigo-pantolon-30076bgd19043",
    "erkek-rahat-kesim-denim-tas-pantolon-30076bgd19501",
  ])

  for (const p of products) {
    if (excludedSlugs.has(p.slug)) {
      skippedCount++
      continue
    }
    const categoryId = createdCategorySlugs.get(p.categorySlug)
    if (!categoryId) {
      console.warn(`Kategori bulunamadı: ${p.categorySlug}, atlandı: ${p.name}`)
      continue
    }

    const existing = await prisma.product.findUnique({ where: { slug: p.slug } })
    if (existing) {
      productCount++
      variantCount += p.variants.length
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
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          size: v.size,
          color: v.color,
          sku: v.sku,
          stock: Math.min(v.stock, 999),
          price: v.price !== p.price ? v.price : null,
        },
      })
      variantCount++
    }
  }

  console.log(`Ürünler: ${productCount} adet, Varyantlar: ${variantCount} adet, Atlanan: ${skippedCount} adet`)
  console.log("Mexelena seed tamamlandı!")

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
