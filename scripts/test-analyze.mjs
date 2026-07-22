import https from 'https';

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject).on('timeout', function() { this.destroy(); reject(new Error('timeout')); });
  });
}

const url = process.argv[2] || 'https://www.mexelena.com.tr/urun/kadin-kruvaze-yaka-cift-dugmeli-siyah-ceket-0722bgd19001';

const html = await fetch(url);
console.log('Size:', html.length, 'bytes');
console.log('Has RSC (next_f):', html.includes('__next_f'));

const prices = html.match(/\d+[.,]\d{2}\s*(?:₺|TL)/g);
console.log('Prices found:', prices);

const title = html.match(/<title>([^<]+)<\/title>/);
console.log('Title:', title ? title[1] : 'N/A');

const imgs = [...new Set([...html.matchAll(/https?:\/\/[^\s"'<>]+(?:jpg|jpeg|png|webp)/gi)].map(m => m[0]))];
console.log('Images:', imgs.length);
imgs.slice(0, 5).forEach(i => console.log(' -', i));

const nextData = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
if (nextData) {
  console.log('Has __NEXT_DATA__:', nextData[1].substring(0, 200));
}

// Check for product JSON anywhere
const productJson = html.match(/\{"product"[^}]+(?:fiyat|price)[^}]+}/gi);
if (productJson) console.log('Product JSON found');

// Find all script tags
const scriptTags = html.match(/<script[^>]*src="([^"]+)"[^>]*>/g);
if (scriptTags) {
  const pageScripts = scriptTags.filter(s => s.includes('page'));
  console.log('Page-specific scripts:', pageScripts.length);
}
