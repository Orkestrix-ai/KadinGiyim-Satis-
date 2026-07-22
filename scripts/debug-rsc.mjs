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

// Extract data between push([1,"...") and the closing "]) 
// The format is: self.__next_f.push([1,"<encoded>"])

const allChunks = [];
// Match the pattern: self.__next_f.push([1,"  followed by content up to "])  
let remaining = html;
let pos = 0;
while (pos < remaining.length) {
  const start = remaining.indexOf('self.__next_f.push([1,"', pos);
  if (start === -1) break;
  const contentStart = start + 'self.__next_f.push([1,"'.length;
  // Find the closing quote + "])"
  // The content is JSON-encoded within the string
  let contentEnd = contentStart;
  let depth = 0;
  let escaped = false;
  while (contentEnd < remaining.length) {
    const ch = remaining[contentEnd];
    if (escaped) {
      escaped = false;
      contentEnd++;
      continue;
    }
    if (ch === '\\') {
      escaped = true;
      contentEnd++;
      continue;
    }
    if (ch === '"' && depth === 0) {
      // Check if followed by "])"
      if (remaining.substring(contentEnd, contentEnd + 3) === '"])') {
        break;
      }
    }
    contentEnd++;
  }
  
  const rawContent = remaining.substring(contentStart, contentEnd);
  allChunks.push(rawContent);
  pos = contentEnd + 3;
}

console.log('Found', allChunks.length, 'chunks');

const fullPayload = allChunks.join('');
console.log('Full payload size:', fullPayload.length, 'bytes');
console.log('\n--- Full payload (first 5000 chars) ---');
console.log(fullPayload.substring(0, 5000));

// Save to file for analysis
import fs from 'fs';
fs.writeFileSync('rsc-payload.txt', fullPayload);
console.log('\nSaved to rsc-payload.txt');
