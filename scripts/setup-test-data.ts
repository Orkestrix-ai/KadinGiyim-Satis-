import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import fs from "fs"
import path from "path"
import { testProducts, testCategories } from "../prisma/test-data"

// Manually load .env file
const envPath = path.resolve(process.cwd(), ".env")
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8")
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eqIdx = trimmed.indexOf("=")
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let value = trimmed.slice(eqIdx + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
}

const IMAGES_DIR = path.resolve(process.cwd(), "public", "images")

interface ImageEntry {
  filename: string
  productName: string
  categoryName: string
  color: string
}

const categoryColorMap: Record<string, { bg: string; text: string }> = {
  "abiye-elbiseler":       { bg: "#1a1a2e", text: "#e94560" },
  "gunluk-elbiseler":      { bg: "#16213e", text: "#f5c518" },
  "ofis-elbiseleri":       { bg: "#0f3460", text: "#ffffff" },
  "tshirt-bluz":           { bg: "#533483", text: "#f0c040" },
  "gomlek":                { bg: "#2c3e50", text: "#ecf0f1" },
  "kazak-hirka":           { bg: "#8b4513", text: "#f5deb3" },
  "mont-kaban":            { bg: "#2f4f4f", text: "#d3d3d3" },
  "ceket":                 { bg: "#1a1a2e", text: "#c0c0c0" },
  "trenckot":              { bg: "#c4a882", text: "#2c1810" },
  "pantolon":              { bg: "#1c1c1c", text: "#808080" },
  "etek":                  { bg: "#d4628f", text: "#ffffff" },
  "sort-bermuda":          { bg: "#4a7c59", text: "#ffffff" },
  "canta":                 { bg: "#8b4513", text: "#ffd700" },
  "taki-mucevher":         { bg: "#f8f8ff", text: "#b8860b" },
  "atki-sal":              { bg: "#cd5c5c", text: "#f5f5dc" },
}

function getCategoryName(slug: string): string {
  const cat = testCategories.find((c) => c.slug === slug)
  return cat?.name ?? slug
}

function getCategoryColor(slug: string): string {
  return categoryColorMap[slug]?.bg ?? "#333333"
}

function generateSvgPlaceholder(
  productName: string,
  categoryName: string,
  index: number,
  bgColor: string,
  textColor: string,
): string {
  const lines = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">',
    `  <defs>`,
    `    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">`,
    `      <stop offset="0%" stop-color="${bgColor}" />`,
    `      <stop offset="100%" stop-color="${adjustColor(bgColor, -30)}" />`,
    `    </linearGradient>`,
    `  </defs>`,
    `  <rect width="800" height="800" fill="url(#bg)" />`,
    `  <circle cx="400" cy="250" r="120" fill="${textColor}22" stroke="${textColor}44" stroke-width="2" />`,
    `  <text x="400" y="240" font-family="system-ui, sans-serif" font-size="48" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${escapeXml(productName)}</text>`,
    `  <text x="400" y="340" font-family="system-ui, sans-serif" font-size="24" fill="${textColor}88" text-anchor="middle">${escapeXml(categoryName)}</text>`,
    `  <text x="400" y="700" font-family="system-ui, sans-serif" font-size="16" fill="${textColor}44" text-anchor="middle">Görsel ${index + 1}</text>`,
    `  <rect x="300" y="380" width="200" height="3" rx="1.5" fill="${textColor}33" />`,
    `  <line x1="250" y1="480" x2="550" y2="480" stroke="${textColor}22" stroke-width="1" />`,
    `  <line x1="300" y1="500" x2="500" y2="500" stroke="${textColor}22" stroke-width="1" />`,
    `  <line x1="280" y1="520" x2="520" y2="520" stroke="${textColor}22" stroke-width="1" />`,
    `</svg>`,
  ]
  return lines.join("\n")
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16)
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount))
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

async function downloadFromPicsum(productName: string, seed: string, dest: string): Promise<boolean> {
  try {
    const url = `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/800`
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return false
    const buffer = Buffer.from(await res.arrayBuffer())
    // Verify it looks like an image (JPEG header)
    if (buffer.length < 100) return false
    fs.writeFileSync(dest, buffer)
    return true
  } catch {
    return false
  }
}

async function generateImages(useLivePhotos: boolean): Promise<number> {
  fs.mkdirSync(IMAGES_DIR, { recursive: true })
  let count = 0

  for (const product of testProducts) {
    const catName = getCategoryName(product.categorySlug)
    const colorInfo = categoryColorMap[product.categorySlug] ?? { bg: "#333", text: "#fff" }

    for (let i = 0; i < product.images.length; i++) {
      const imgPath = product.images[i]
      const filename = path.basename(imgPath)
      const dest = path.join(IMAGES_DIR, filename)

      if (fs.existsSync(dest)) {
        continue
      }

      let downloaded = false
      if (useLivePhotos) {
        const seed = `kadingiyim-${product.slug}-${i}`
        downloaded = await downloadFromPicsum(product.name, seed, dest)
      }

      if (!downloaded) {
        const svg = generateSvgPlaceholder(
          product.name,
          catName,
          i,
          colorInfo.bg,
          colorInfo.text,
        )
        fs.writeFileSync(dest, svg, "utf-8")
      }
      count++
    }
  }

  return count
}

async function updatePrices() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  const prisma = new PrismaClient({ adapter })

  console.log("\n📦 Veritabanına bağlanıldı, fiyatlar güncelleniyor...\n")

  // Test price adjustments per category
  const priceAdjustments: Record<string, { productMultiplier?: number; variantAdjustments?: Record<string, number> }> = {
    "abiye-elbiseler": {
      productMultiplier: 1.0,
      variantAdjustments: { "XL": 50, "S": -30 },
    },
    "gunluk-elbiseler": { productMultiplier: 0.9 },
    "ofis-elbiseleri": { productMultiplier: 1.0 },
    "tshirt-bluz": { productMultiplier: 1.0, variantAdjustments: { "XS": -10, "XL": 10 } },
    "gomlek": { productMultiplier: 1.0 },
    "kazak-hirka": { productMultiplier: 0.85 },
    "mont-kaban": { productMultiplier: 1.0 },
    "ceket": { productMultiplier: 1.0 },
    "trenckot": { productMultiplier: 0.9 },
    "pantolon": { productMultiplier: 1.0 },
    "etek": { productMultiplier: 1.0 },
    "sort-bermuda": { productMultiplier: 0.8 },
    "canta": { productMultiplier: 1.0 },
    "taki-mucevher": { productMultiplier: 0.9 },
    "atki-sal": { productMultiplier: 0.85 },
  }

  let updatedBase = 0
  let updatedVariants = 0

  for (const product of testProducts) {
    const dbProduct = await prisma.product.findUnique({
      where: { slug: product.slug },
      include: { variants: true },
    })
    if (!dbProduct) {
      console.warn(`  ⚠ Ürün bulunamadı: ${product.name}`)
      continue
    }

    const adj = priceAdjustments[product.categorySlug]

    // Update base price
    if (adj?.productMultiplier && adj.productMultiplier !== 1.0) {
      const newPrice = Math.round(product.price * adj.productMultiplier * 100) / 100
      await prisma.product.update({
        where: { id: dbProduct.id },
        data: { price: newPrice },
      })
      console.log(`  💰 ${product.name}: ${product.price} TL → ${newPrice} TL (${adj.productMultiplier}x)`)
      updatedBase++
    }

    // Update variant prices (set some variant overrides)
    if (adj?.variantAdjustments) {
      for (const variant of dbProduct.variants) {
        const adjustment = adj.variantAdjustments[variant.size]
        if (adjustment !== undefined) {
          const basePrice = adj.productMultiplier
            ? Math.round(product.price * adj.productMultiplier * 100) / 100
            : product.price
          const newPrice = Math.round(Math.max(0, basePrice + adjustment) * 100) / 100
          await prisma.productVariant.update({
            where: { id: variant.id },
            data: { price: newPrice },
          })
          console.log(`  🔄 ${product.name} (${variant.size}/${variant.color}): ${basePrice} TL → ${newPrice} TL`)
          updatedVariants++
        }
      }
    }
  }

  await prisma.$disconnect()
  return { updatedBase, updatedVariants }
}

async function main() {
  console.log("╔══════════════════════════════════════════════════╗")
  console.log("║   Nevrak - Test Verisi Kurulum Aracı          ║")
  console.log("╚══════════════════════════════════════════════════╝\n")

  const usePhotos = process.argv.includes("--live")

  // Step 1: Generate images
  console.log("📸 Ürün görselleri oluşturuluyor...")
  const imgCount = await generateImages(usePhotos)
  if (imgCount > 0) {
    console.log(`  ✅ ${imgCount} yeni görsel oluşturuldu → ${IMAGES_DIR}`)
  } else {
    console.log(`  ℹ️  Tüm görseller zaten mevcut (${IMAGES_DIR})`)
  }

  // Summary by category
  const catGroups: Record<string, typeof testProducts> = {}
  for (const p of testProducts) {
    const catName = getCategoryName(p.categorySlug)
    if (!catGroups[catName]) catGroups[catName] = []
    catGroups[catName].push(p)
  }

  console.log("\n📁 Kategorilere göre ürünler:\n")
  for (const [catName, products] of Object.entries(catGroups)) {
    console.log(`  📂 ${catName} (${products.length} ürün)`)
    for (const p of products) {
      console.log(`     • ${p.name} → ${p.images.length} görsel`)
    }
    console.log()
  }

  // Step 2: Update prices in DB
  console.log("💰 Test fiyatları güncelleniyor...")
  const { updatedBase, updatedVariants } = await updatePrices()
  console.log(`  ✅ ${updatedBase} ürün fiyatı güncellendi`)
  if (updatedVariants > 0) {
    console.log(`  ✅ ${updatedVariants} varyant fiyatı güncellendi`)
  }

  console.log("\n╔══════════════════════════════════════════════════╗")
  console.log("║   ✨ Kurulum tamamlandı!                        ║")
  console.log("╚══════════════════════════════════════════════════╝")
  console.log("\n📌 Notlar:")
  console.log("  • Görseller SVG placeholder olarak oluşturuldu")
  console.log("  • Gerçek fotoğraflar için: npx tsx scripts/setup-test-data.ts --live")
  console.log("  • Fiyatlar indirim/kampanya simülasyonu için güncellendi")
}

main().catch((e) => {
  console.error("❌ Hata:", e)
  process.exit(1)
})
