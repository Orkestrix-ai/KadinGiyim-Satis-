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

// Find all next_f chunks
const nextFMatches = html.match(/self\.__next_f[^;]*;/g);
console.log('Number of next_f chunks:', nextFMatches ? nextFMatches.length : 0);
if (nextFMatches) {
  nextFMatches.slice(0, 10).forEach((m, i) => {
    console.log(`\n--- Chunk ${i} (${m.length} chars) ---`);
    console.log(m.substring(0, 500));
  });
}

// Also dump some context around the first next_f reference
const idx = html.indexOf('__next_f');
if (idx > -1) {
  console.log('\n\n--- Context around first __next_f ---');
  console.log(html.substring(Math.max(0, idx-100), idx+200));
}

// Try to find any product-related content
const productIdx = html.toLowerCase().indexOf('product');
if (productIdx > -1) {
  console.log('\n\n--- Context around "product" ---');
  console.log(html.substring(Math.max(0, productIdx-50), productIdx+200));
}

const urunIdx = html.toLowerCase().indexOf('urun');
if (urunIdx > -1) {
  console.log('\n\n--- Context around "urun" ---');
  console.log(html.substring(Math.max(0, urunIdx-50), urunIdx+200));
}
