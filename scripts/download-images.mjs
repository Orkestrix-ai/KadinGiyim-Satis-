import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const images = [
  {file:'abiye-1-1',seed:'dress-red'},{file:'abiye-1-2',seed:'dress-elegant'},{file:'abiye-1-3',seed:'dress-formal'},
  {file:'abiye-2-1',seed:'evening-gown'},{file:'abiye-2-2',seed:'cocktail-dress'},{file:'gunluk-1-1',seed:'casual-dress'},
  {file:'gunluk-1-2',seed:'summer-dress'},{file:'gunluk-2-1',seed:'linen-dress'},{file:'gunluk-2-2',seed:'floral-dress'},
  {file:'ofis-1-1',seed:'office-dress'},{file:'ofis-1-2',seed:'work-dress'},{file:'tshirt-1-1',seed:'white-blouse'},
  {file:'tshirt-1-2',seed:'cotton-top'},{file:'bluz-1-1',seed:'silk-blouse'},{file:'bluz-1-2',seed:'printed-blouse'},
  {file:'gomlek-1-1',seed:'white-shirt'},{file:'gomlek-1-2',seed:'office-shirt'},{file:'kazak-1-1',seed:'wool-sweater'},
  {file:'kazak-1-2',seed:'cardigan'},{file:'mont-1-1',seed:'winter-coat'},{file:'mont-1-2',seed:'puffer-jacket'},
  {file:'ceket-1-1',seed:'blazer'},{file:'ceket-1-2',seed:'jacket'},{file:'trenckot-1-1',seed:'trench-coat'},
  {file:'trenckot-1-2',seed:'beige-coat'},{file:'pantolon-1-1',seed:'black-trousers'},{file:'pantolon-1-2',seed:'dress-pants'},
  {file:'kot-1-1',seed:'blue-jeans'},{file:'kot-1-2',seed:'skinny-jeans'},{file:'etek-1-1',seed:'mini-skirt'},
  {file:'etek-1-2',seed:'pleated-skirt'},{file:'etek-2-1',seed:'midi-skirt'},{file:'etek-2-2',seed:'a-line-skirt'},
  {file:'sort-1-1',seed:'denim-shorts'},{file:'sort-1-2',seed:'cotton-shorts'},{file:'canta-1-1',seed:'leather-bag'},
  {file:'canta-1-2',seed:'shoulder-bag'},{file:'taki-1-1',seed:'gold-bracelet'},{file:'taki-1-2',seed:'jewelry-set'},
  {file:'taki-2-1',seed:'pearl-necklace'},{file:'taki-2-2',seed:'silver-earrings'},{file:'atki-1-1',seed:'wool-scarf'},
  {file:'atki-1-2',seed:'patterned-scarf'},{file:'sal-1-1',seed:'lace-shawl'},{file:'sal-1-2',seed:'pashmina-shawl'}
];

function download(url, filePath) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        download(res.headers.location, filePath).then(resolve);
        return;
      }
      const stream = fs.createWriteStream(filePath);
      res.pipe(stream);
      stream.on('finish', () => { stream.close(); resolve(); });
    }).on('error', () => resolve());
  });
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(__dirname, '../public/images');
let i = 0;

for (const img of images) {
  i++;
  const url = 'https://picsum.photos/seed/' + img.seed + '/600/900';
  const fp = path.join(dir, img.file + '.jpg');
  await download(url, fp);
  const size = fs.existsSync(fp) ? fs.statSync(fp).size : 0;
  console.log('[' + i + '/' + images.length + '] ' + img.file + ' (' + size + ' bytes)');
}
console.log('Done!');
