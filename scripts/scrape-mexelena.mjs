import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../scraped-data');
fs.mkdirSync(DATA_DIR, { recursive: true });

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', reject).on('timeout', function() { this.destroy(); reject(new Error('timeout')); });
  });
}

const API_BASE = 'https://www.mexelena.com.tr/api/products';

// Step 1: Fetch first page to get total count
console.log('Fetching page 1...');
const firstPage = JSON.parse(await fetch(`${API_BASE}?per_page=24&page=1`));
const totalProducts = firstPage.total;
const totalPages = firstPage.pages;
console.log(`Total: ${totalProducts} products, ${totalPages} pages`);

// Step 2: Fetch all pages
const allProducts = [...firstPage.products];
const categoryMap = new Map(); // slug -> { name, slug, main_category, top_category }

for (let page = 2; page <= totalPages; page += 20) {
  const batch = [];
  for (let p = page; p < page + 20 && p <= totalPages; p++) {
    batch.push(fetch(`${API_BASE}?per_page=24&page=${p}`).then(JSON.parse));
  }
  const results = await Promise.all(batch);
  for (const r of results) {
    for (const p of r.products) {
      allProducts.push(p);
      // Extract category info
      const attrs = p.attributes || {};
      const catSlug = p.category?.slug;
      if (catSlug && !categoryMap.has(catSlug)) {
        categoryMap.set(catSlug, {
          id: p.category?.id,
          name: p.category?.name,
          slug: catSlug,
          main_category: attrs.main_category || '',
          top_category: attrs.top_category || '',
          sub_category: attrs.sub_category || '',
        });
      }
    }
  }
  console.log(`Fetched pages ${page}-${Math.min(page+19, totalPages)}, total: ${allProducts.length}/${totalProducts}`);
}

// Step 3: Save raw data
fs.writeFileSync(path.join(DATA_DIR, 'products.json'), JSON.stringify(allProducts, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'categories.json'), JSON.stringify([...categoryMap.values()], null, 2));
console.log(`\nSaved ${allProducts.length} products and ${categoryMap.size} categories to scraped-data/`);

// Step 4: Show category hierarchy
const hierarchy = {};
for (const cat of categoryMap.values()) {
  const mc = cat.main_category || 'Diğer';
  const tc = cat.top_category || 'Diğer';
  if (!hierarchy[mc]) hierarchy[mc] = {};
  if (!hierarchy[mc][tc]) hierarchy[mc][tc] = [];
  hierarchy[mc][tc].push(cat.name);
}
console.log('\n=== Category Hierarchy ===');
for (const [mc, tops] of Object.entries(hierarchy)) {
  console.log(`\n${mc}:`);
  for (const [tc, cats] of Object.entries(tops)) {
    console.log(`  ${tc}: ${cats.join(', ')}`);
  }
}

// Step 5: Count products by main category
const mcCount = {};
for (const p of allProducts) {
  const mc = p.attributes?.main_category || 'Diğer';
  mcCount[mc] = (mcCount[mc] || 0) + 1;
}
console.log('\n=== Products by Main Category ===');
for (const [mc, count] of Object.entries(mcCount).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${mc}: ${count}`);
}
