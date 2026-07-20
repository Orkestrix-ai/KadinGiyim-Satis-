# Kadın Giyim E-Ticaret Sitesi — Ürün Gereksinim Belgesi (PRD)

## Problem

Kadın giyim ürünlerini satmak için modern, hızlı, mobil uyumlu ve yönetimi kolay bir e-ticaret altyapısına ihtiyaç var. Mevcut hazır çözümler (WooCommerce, Shopify vb.) ya gereğinden pahalı, ya özelleştirmesi zor, ya da performans sorunlu. Sıfırdan, ihtiyaca özel bir e-ticaret platformu ile pazara çıkmak ve gerektiğinde hızlıca yeni özellik ekleyebilmek hedefleniyor.

## Çözüm

Next.js, Tailwind CSS ve PostgreSQL ile inşa edilmiş, modern, full-stack bir kadın giyim e-ticaret sitesi. Kullanıcılar ürünleri katalogdan gezebilir, sepete ekleyebilir, kredi kartı ile ödeyebilir ve siparişlerini takip edebilir. Site yöneticisi aynı uygulama içinde `/admin` panelinden ürün, sipariş ve kullanıcı yönetimini yapabilir. Kargo entegrasyonu ile otomatik takip kodu oluşturulur.

## Kullanıcı Hikayeleri

1. Bir ziyaretçi olarak, ürünleri kategorilere göre listelenmiş görmek istiyorum, böylece ilgimi çeken ürünlere kolayca ulaşabilirim.
2. Bir ziyaretçi olarak, ürünleri fiyat, beden, renk ve markaya göre filtrelemek istiyorum, böylece aradığım ürünü hızlıca bulabilirim.
3. Bir ziyaretçi olarak, ürün adı veya açıklamasında arama yapmak istiyorum, böylece spesifik bir ürünü bulabilirim.
4. Bir ziyaretçi olarak, ürün detay sayfasında birden çok fotoğraf, beden tablosu ve ürün açıklaması görmek istiyorum, böylece ürün hakkında bilinçli karar verebilirim.
5. Bir ziyaretçi olarak, stokta olmayan beden/renk kombinasyonlarının tükenmiş göründüğünü görmek istiyorum, böylece sipariş veremeyeceğimi önceden bilirim.
6. Bir kullanıcı olarak, sepete ürün ekleyip çıkarabilmek ve sepet içeriğini görmek istiyorum, böylece siparişe hazırlanabilirim.
7. Bir kullanıcı olarak, sepete uygulanabilir bir indirim kuponu kodu girmek istiyorum, böylece ürünleri indirimli alabilirim.
8. Bir kullanıcı olarak, e-posta adresim ve şifre ile kayıt olup giriş yapmak istiyorum, böylece sipariş geçmişime erişebilirim.
9. Bir kullanıcı olarak, Google veya Facebook hesabımla hızlı giriş yapmak istiyorum, böylece kayıt formu doldurmak zorunda kalmam.
10. Bir kullanıcı olarak, adres bilgilerimi kaydedip sonraki siparişlerimde kullanmak istiyorum, böylece her seferinde aynı bilgileri girmem gerekmez.
11. Bir kullanıcı olarak, ödeme sayfasında adres ve fatura bilgilerini girip kredi kartımla güvenli (3D Secure) ödeme yapmak istiyorum, böylece siparişimi tamamlayabilirim.
12. Bir kullanıcı olarak, sipariş onayını e-posta ile almak istiyorum, böylece siparişimin alındığını bilirim.
13. Bir kullanıcı olarak, siparişlerimin durumunu (hazırlanıyor, kargoda, teslim edildi) takip etmek istiyorum, böylece tahmini teslimatı bilebilirim.
14. Bir kullanıcı olarak, siparişim kargoya verildiğinde kargo takip numarası ve linki görmek istiyorum, böylece kargoyu kendi başıma takip edebilirim.
15. Bir kullanıcı olarak, profilimden sipariş geçmişimi listeleyip detaylarına bakmak istiyorum, böylece daha önce aldıklarımı görebilirim.
16. Bir kullanıcı olarak, şifremi unuttuysam e-posta ile sıfırlayabilmek istiyorum, böylece hesabıma tekrar erişebilirim.
17. Bir admin olarak, ürün ekleme, düzenleme ve silme yapabileceğim bir yönetim paneline erişmek istiyorum, böylece kataloğu güncel tutabilirim.
18. Bir admin olarak, ürünlere birden çok fotoğraf, beden seçeneği, renk seçeneği ve stok bilgisi ekleyebilmek istiyorum, böylece varyasyonlu ürünleri yönetebilirim.
19. Bir admin olarak, gelen siparişleri listeleyip durumlarını güncellemek istiyorum, böylece operasyonu yönetebilirim.
20. Bir admin olarak, müşteri siparişlerine kargo takip numarası atamak istiyorum, böylece müşteri siparişini takip edebilir.
21. Bir admin olarak, kayıtlı kullanıcıları görüntülemek istiyorum, böylece müşteri tabanını analiz edebilirim.
22. Bir admin olarak, indirim kuponları tanımlayıp yönetmek istiyorum, böylece kampanya yapabilirim.
23. Bir ziyaretçi olarak, siteyi mobil cihazlardan rahatça kullanabilmek istiyorum, böylece telefonumdan da alışveriş yapabilirim.
24. Bir kullanıcı olarak, SSL ile korunan bir sitede alışveriş yaptığımı görmek istiyorum, böylece kart bilgilerimin güvende olduğunu bilirim.

## Uygulama Kararları

### Teknoloji Yığını
- Frontend/Backend: Next.js (App Router), TypeScript
- UI Kütüphanesi: Tailwind CSS + shadcn/ui
- Veritabanı: PostgreSQL (Supabase)
- ORM: Prisma
- Kimlik Doğrulama: NextAuth.js (e-posta/şifre, Google, Facebook)
- Ödeme: Iyzico / PayTR (3D Secure kredi kartı)
- Kargo: MNG/Yurtiçi/Aras kargo API entegrasyonu
- Dosya Saklama: Vercel Blob / AWS S3
- Deployment: Vercel

### Modüller
1. **Product Catalog Module** — Ürün listeleme, kategorilendirme, filtreleme, arama, varyasyon yönetimi (beden/renk/stok), çoklu fotoğraf
2. **User Module** — Kayıt, giriş, sosyal giriş, şifre sıfırlama, profil yönetimi, adres yönetimi
3. **Cart Module** — Sepet CRUD, sepet birleştirme (misafir → giriş yapmış), kupon uygulama
4. **Order Module** — Sipariş oluşturma, sipariş durumu yönetimi, e-posta bildirimi, sipariş geçmişi
5. **Payment Module** — Iyzico/PayTR entegrasyonu, 3D Secure, ödeme akışı
6. **Shipping Module** — Kargo API entegrasyonu, takip numarası oluşturma, takip linki
7. **Admin Module** — `/admin` paneli: ürün, sipariş, kullanıcı, kupon CRUD yönetimi

### Mimari Kararlar
- Admin paneli, Next.js ile aynı projede `/admin` route'ları altında, ayrı layout ile çalışır. Yetkilendirme middleware ile kontrol edilir.
- Tüm sunucu tarafı işlemler Prisma üzerinden PostgreSQL'e erişir.
- Misafir sepeti (localStorage) kullanıcı giriş yaptığında sunucu tarafı sepete birleştirilir.
- Ürün varyasyonları (beden + renk) ayrı bir `ProductVariant` tablosunda tutulur, ana ürünle ilişkilendirilir.
- Ödeme callback'leri (webhook) ile doğrulanır, sipariş durumu otomatik güncellenir.
- E-posta bildirimleri için Resend veya benzer bir SMTP hizmeti kullanılır.

### Veritabanı Şeması (Ana Varlıklar)
- `User` — id, email, name, password (hash), image, role (user/admin), createdAt
- `Account` / `Session` — NextAuth.js için
- `Category` — id, name, slug, parentId (opsiyonel)
- `Product` — id, name, slug, description, price, images[], categoryId, featured, createdAt
- `ProductVariant` — id, productId, size, color, sku, stock, price (override)
- `Cart` — id, userId (nullable, misafir için null)
- `CartItem` — id, cartId, variantId, quantity
- `Order` — id, userId, status (pending/processing/shipped/delivered/cancelled), total, shippingAddress, billingAddress, cargoCode, cargoCompany, createdAt
- `OrderItem` — id, orderId, variantId, quantity, unitPrice
- `Coupon` — id, code, discountType (percentage/fixed), discountValue, minAmount, usageLimit, expiresAt
- `Address` — id, userId, title, fullName, phone, city, district, fullAddress, isDefault

## Test Kararları

- **Test Stratejisi:** Dışa dönük davranış test edilir. İç implementasyon detayları test edilmez.
- Tüm modüller (Product, User, Cart, Order, Payment, Shipping, Admin) test edilecek.
- **Kapsam:**
  - Unit testler: Modül fonksiyonları ve API route'ları
  - Entegrasyon testleri: Veritabanı CRUD, ödeme callback akışı, kargo API (mock ile)
  - E2E testleri: Kritik kullanıcı akışları (ürün gör → sepete ekle → ödeme → sipariş takibi)
- **Araçlar:** Vitest (unit/entegrasyon), Playwright (E2E), MSW (API mock)
- **İyi Test Tanımı:** Bir koşul ver, bir eylem yap, bir sonuç bekle. Dış dünyaya yansıyan davranışı test et.

## Kabul Kriterleri

1. Ürün kataloğu (kategori, filtre, arama, varyasyon) mobil + masaüstünde hatasız çalışır.
2. Kullanıcı kaydı, girişi, sosyal giriş (Google, Facebook) ve şifre sıfırlama çalışır.
3. Sepet CRUD, kupon uygulama ve misafir sepet birleştirme çalışır.
4. 3D Secure kredi kartı ödemesi başarılı ve başarısız akışları çalışır.
5. Sipariş onay e-postası gönderilir. Sipariş durumu güncellenebilir.
6. Admin panelinde ürün, sipariş, kullanıcı ve kupon CRUD işlemleri çalışır.
7. Kargo takip kodu oluşur ve müşteri bildirimi gönderilir.
8. Site responsive (mobil, tablet, masaüstü) düzgün görüntülenir.
9. Tüm testler geçer. `npm run build` hatasız tamamlanır.
10. SSL ile sunulur, ödeme sayfası güvenli bağlantı üzerinden çalışır.

## Kapsam Dışı

- Mobil uygulama (iOS/Android)
- Çoklu dil desteği
- Çoklu para birimi
- Pazaryeri entegrasyonu (Trendyol, Hepsiburada)
- Canlı destek / chatbot
- Gelişmiş analitik / öneri motoru
- İade/değişim süreci otomasyonu (MVP'de manuel)

## Notlar

- Ödeme entegratörü (Iyzico / PayTR) kararı entegrasyon kolaylığına göre verilecek.
- Kargo firması (MNG/Yurtiçi/Aras) operasyonel karara bağlı.
- Ürün varyasyonları (beden XS-5XL + renk) bağımsız stok takibi yapacak.
- Testlerde MSW ile ödeme ve kargo API mock'ları kullanılacak.
- Bu PRD, `D:\Opencode\KadınGiyim` altında sıfırdan inşa edilecek proje içindir.
