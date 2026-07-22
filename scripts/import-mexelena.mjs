import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../scraped-data');
const IMG_DIR = path.resolve(__dirname, '../public/images/mexelena');
fs.mkdirSync(IMG_DIR, { recursive: true });

const allProducts = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'products.json'), 'utf8'));
const products = allProducts.filter(p => p.is_active && parseInt(p.stock || '0') > 0);
console.log(`Processing ${products.length}/${allProducts.length} active products with stock`);

// === CATEGORY MAPPING ===
const CATEGORY_MAP = [
  { match: n => n.includes('Elbise'), parent: 'elbiseler', slug: 'elbise' },
  { match: n => n.includes('Bluz') || n.includes('T-Shirt'), parent: 'ust-giyim', slug: 'tshirt-bluz' },
  { match: n => n === 'Kadın Gömlek' || n === 'Gömlek', parent: 'ust-giyim', slug: 'gomlek' },
  { match: n => n.includes('Kazak'), parent: 'ust-giyim', slug: 'kazak-hirka' },
  { match: n => n.includes('Hırka') || n.includes('Sweatshirt') || n.includes('Swetshirt') || n.includes('Yelek'), parent: 'ust-giyim', slug: 'kazak-hirka' },
  { match: n => n === 'Kadın Ceket' || n === 'Ceket', parent: 'dis-giyim', slug: 'ceket' },
  { match: n => n.includes('Mont'), parent: 'dis-giyim', slug: 'mont-kaban' },
  { match: n => n.includes('Kaban'), parent: 'dis-giyim', slug: 'mont-kaban' },
  { match: n => n.includes('Trençkot') || n.includes('Trenckot'), parent: 'dis-giyim', slug: 'trenckot' },
  { match: n => n.includes('Tunik') || n.includes('Panço') || n.includes('Kimono'), parent: 'dis-giyim', slug: 'tunik' },
  { match: n => n.includes('İkili') || n.includes('Takım'), parent: 'dis-giyim', slug: 'ikili-takim' },
  { match: n => n.includes('Pantolon'), parent: 'alt-giyim', slug: 'pantolon' },
  { match: n => n.includes('Etek'), parent: 'alt-giyim', slug: 'etek' },
  { match: n => n.includes('Şort') || n.includes('Sort'), parent: 'alt-giyim', slug: 'sort-bermuda' },
  { match: n => n.includes('Tulum') || n.includes('Eşofman') || n.includes('Pijama') || n.includes('TAYT'), parent: 'alt-giyim', slug: 'tayt' },
  { match: n => n.includes('Çanta'), parent: 'aksesuar', slug: 'canta' },
  { match: n => n.includes('Atkı') || n.includes('Şal') || n.includes('Bere'), parent: 'aksesuar', slug: 'atki-sal' },
  { match: n => n.includes('Terlik'), parent: 'aksesuar', slug: 'terlik' },
  { match: n => n.includes('KEMER'), parent: 'aksesuar', slug: 'kemer' },
  { match: () => true, parent: 'aksesuar', slug: 'aksesuar' }, // fallback
];

function mapCategory(p) {
  const name = p.category?.name || '';
  for (const rule of CATEGORY_MAP) {
    if (rule.match(name)) return rule;
  }
  return CATEGORY_MAP[CATEGORY_MAP.length - 1];
}

// === Generate seed data ===
const catCounts = {};
const seedProducts = [];

for (const p of products) {
  const mapped = mapCategory(p);
  const key = mapped.slug;
  catCounts[key] = (catCounts[key] || 0) + 1;

  const images = (p.images || []).filter(Boolean);
  const desc = (p.description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 500);

  const variants = p.variants || [];
  const colors = [...new Set(variants.filter(v => v.variant_type === 'color').map(v => v.variant_value))];
  const sizes = [...new Set(variants.filter(v => v.variant_type === 'size').map(v => v.variant_value))];

  // Generate color-size combination variants
  const skuBase = p.sku || p.model_code || '';
  const productVariants = [];
  if (colors.length > 0 && sizes.length > 0) {
    for (const color of colors) {
      for (const size of sizes) {
        const variantStock = variants.find(v => v.variant_type === 'size' && v.variant_value === size)?.stock || 0;
        productVariants.push({
          size,
          color,
          sku: `${skuBase}-${color.substring(0, 3)}-${size}`,
          stock: parseInt(variantStock) || 0,
          price: parseFloat(p.price),
        });
      }
    }
  } else if (colors.length > 0) {
    for (const color of colors) {
      productVariants.push({
        size: 'STD',
        color,
        sku: `${skuBase}-${color.substring(0, 3)}`,
        stock: parseInt(p.stock) || 0,
        price: parseFloat(p.price),
      });
    }
  } else if (sizes.length > 0) {
    for (const size of sizes) {
      productVariants.push({
        size,
        color: 'Standart',
        sku: `${skuBase}-${size}`,
        stock: parseInt(p.stock) || 0,
        price: parseFloat(p.price),
      });
    }
  } else {
    productVariants.push({
      size: 'STD',
      color: 'Standart',
      sku: skuBase || p.slug,
      stock: parseInt(p.stock) || 0,
      price: parseFloat(p.price),
    });
  }

  seedProducts.push({
    name: p.name,
    slug: p.slug,
    description: desc,
    price: parseFloat(p.price),
    images: images.map((img, idx) => {
      const ext = path.extname(new URL(img).pathname) || '.jpg';
      return `/images/mexelena/${p.slug}-${idx}${ext}`;
    }),
    categorySlug: mapped.slug,
    featured: false,
    variants: productVariants,
    supplierPrice: parseFloat(p.price),
    supplierProductId: p.sku || p.model_code || p.slug,
  });
}

console.log('\n=== Category Distribution ===');
for (const [slug, count] of Object.entries(catCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${slug}: ${count}`);
}

// Save seed data
const seedOutput = { products: seedProducts, categories: catCounts };
fs.writeFileSync(path.join(DATA_DIR, 'seed-data.json'), JSON.stringify(seedOutput, null, 2));
console.log(`\nSeed data saved: ${seedProducts.length} products`);

// === DOWNLOAD IMAGES ===
console.log('\n=== Downloading Images ===');

function downloadImage(url, filePath) {
  return new Promise((resolve) => {
    if (!url || !url.startsWith('http')) { resolve(false); return; }
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }, (r) => {
          if (r.statusCode !== 200) { r.resume(); resolve(false); return; }
          const stream = fs.createWriteStream(filePath);
          r.pipe(stream);
          stream.on('finish', () => { stream.close(); resolve(true); });
        }).on('error', () => resolve(false));
        return;
      }
      if (res.statusCode !== 200) { res.resume(); resolve(false); return; }
      const stream = fs.createWriteStream(filePath);
      res.pipe(stream);
      stream.on('finish', () => { stream.close(); resolve(true); });
    }).on('error', () => resolve(false)).on('timeout', function() { this.destroy(); resolve(false); });
  });
}

// Download first image per product
let ok = 0, fail = 0;
const total = seedProducts.length;

for (let i = 0; i < total; i += 10) {
  const batch = [];
  for (let j = i; j < i + 10 && j < total; j++) {
    const sp = seedProducts[j];
    const imgPath = sp.images[0];
    if (!imgPath) { fail++; continue; }
    const fullPath = path.join(__dirname, '..', 'public', imgPath);
    const dir = path.dirname(fullPath);
    fs.mkdirSync(dir, { recursive: true });
    if (fs.existsSync(fullPath)) { ok++; continue; }

    const p = allProducts.find(x => x.slug === sp.slug);
    const imgUrl = p?.images?.[0];
    if (!imgUrl) { fail++; continue; }

    batch.push(downloadImage(imgUrl, fullPath).then(success => {
      if (success) ok++; else fail++;
    }));
  }
  await Promise.all(batch);
  if ((i + 10) % 200 === 0 || i + 10 >= total) {
    const pct = Math.round((i + 10) / total * 100);
    console.log(`  [${pct}%] ${Math.min(i + 10, total)}/${total} - OK: ${ok}, FAIL: ${fail}`);
  }
}

console.log(`\nDone! ${ok} images OK, ${fail} failed`);
