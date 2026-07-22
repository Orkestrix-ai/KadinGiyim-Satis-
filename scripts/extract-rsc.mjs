import https from 'https';

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', reject).on('timeout', function() { this.destroy(); reject(new Error('timeout')); });
  });
}

const url = process.argv[2] || 'https://www.mexelena.com.tr/urun/kadin-kruvaze-yaka-cift-dugmeli-siyah-ceket-0722bgd19001';
const html = await fetch(url);

// Find all next_f chunks and join them
const chunks = [];
const re = /self\.__next_f\.push\(\[1,\s*("[^"]*")\s*\]\)/g;
let m;
while ((m = re.exec(html)) !== null) {
  try {
    const decoded = JSON.parse(m[1]);
    chunks.push(decoded);
  } catch(e) {}
}

const fullPayload = chunks.join('');
console.log('Total RSC payload size:', fullPayload.length, 'bytes');

// Look for product-related keywords in the decoded payload
const keywords = ['fiyat', 'Fiyat', 'price', 'Price', '₺', 'renk', 'Renk', 'beden', 'Beden', 'size', 'Size', 'stok', 'Stok', 'stock', 'Stock', 'urun', 'Urun', 'product', 'Product', 'gorsel', 'Gorsel', 'image', 'Image', 'aciklama', 'Aciklama', 'description', 'Description'];
console.log('\nSearching for product data in RSC payload:');
for (const kw of keywords) {
  let idx = fullPayload.indexOf(kw);
  if (idx === -1) {
    idx = fullPayload.indexOf(kw.toLowerCase());
  }
  if (idx > -1) {
    console.log(`\n--- '${kw}' at ${idx} ---`);
    console.log(fullPayload.substring(Math.max(0, idx-100), idx+300));
  }
}

// Also search in original HTML for any encoded data
console.log('\n\n--- Raw HTML search for price patterns ---');
const rawHtmlSearches = [
  { label: 'TL or lira', re: /\d+[.,]\d{1,2}\s*(TL|lira|₺)/gi },
  { label: 'price attribute', re: /"[^"]*price[^"]*"\s*:\s*"[^"]*"/gi },
  { label: 'fiyat attribute', re: /"[^"]*fiyat[^"]*"\s*:\s*"[^"]*"/gi },
  { label: 'JSON price', re: /\bprice["\s:]+\d+[.,]\d+/gi },
  { label: 'JSON fiyat', re: /\bfiyat["\s:]+\d+[.,]\d+/gi },
];
for (const s of rawHtmlSearches) {
  const results = html.match(s.re);
  if (results && results.length > 0) {
    console.log(`${s.label}:`, results.slice(0, 5));
  } else {
    console.log(`${s.label}: not found`);
  }
}
