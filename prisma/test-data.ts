export const testUsers = [
  {
    name: "Admin",
    email: "admin@modacini.com",
    password: "admin123",
    role: "ADMIN" as const,
  },
  {
    name: "Zeynep Yılmaz",
    email: "zeynep@example.com",
    password: "test123",
    role: "USER" as const,
  },
  {
    name: "Ayşe Demir",
    email: "ayse@example.com",
    password: "test123",
    role: "USER" as const,
  },
  {
    name: "Elif Kaya",
    email: "elif@example.com",
    password: "test123",
    role: "USER" as const,
  },
]

export const testCategories = [
  { name: "Elbiseler", slug: "elbiseler", parentSlug: null },
  { name: "Üst Giyim", slug: "ust-giyim", parentSlug: null },
  { name: "Dış Giyim", slug: "dis-giyim", parentSlug: null },
  { name: "Alt Giyim", slug: "alt-giyim", parentSlug: null },
  { name: "Aksesuar", slug: "aksesuar", parentSlug: null },

  { name: "Abiye Elbiseler", slug: "abiye-elbiseler", parentSlug: "elbiseler" },
  { name: "Günlük Elbiseler", slug: "gunluk-elbiseler", parentSlug: "elbiseler" },
  { name: "Ofis Elbiseleri", slug: "ofis-elbiseleri", parentSlug: "elbiseler" },

  { name: "T-shirt & Bluz", slug: "tshirt-bluz", parentSlug: "ust-giyim" },
  { name: "Gömlek", slug: "gomlek", parentSlug: "ust-giyim" },
  { name: "Kazak & Hırka", slug: "kazak-hirka", parentSlug: "ust-giyim" },

  { name: "Mont & Kaban", slug: "mont-kaban", parentSlug: "dis-giyim" },
  { name: "Ceket", slug: "ceket", parentSlug: "dis-giyim" },
  { name: "Trençkot", slug: "trenckot", parentSlug: "dis-giyim" },

  { name: "Pantolon", slug: "pantolon", parentSlug: "alt-giyim" },
  { name: "Etek", slug: "etek", parentSlug: "alt-giyim" },
  { name: "Şort & Bermuda", slug: "sort-bermuda", parentSlug: "alt-giyim" },

  { name: "Çanta", slug: "canta", parentSlug: "aksesuar" },
  { name: "Takı & Mücevher", slug: "taki-mucevher", parentSlug: "aksesuar" },
  { name: "Atkı & Şal", slug: "atki-sal", parentSlug: "aksesuar" },
]

export const testProducts: { name: string; slug: string; description: string; price: number; categorySlug: string; featured: boolean; images: string[]; variants: { size: string; color: string; sku: string; stock: number; price: number | null }[] }[] = []

export const testAddresses = [
  {
    userEmail: "zeynep@example.com",
    title: "Ev Adresim",
    fullName: "Zeynep Yılmaz",
    phone: "05321234567",
    city: "İstanbul",
    district: "Kadıköy",
    fullAddress: "Caferağa Mah. Moda Cad. No:45 D:12 Kadıköy/İstanbul",
    isDefault: true,
  },
  {
    userEmail: "zeynep@example.com",
    title: "İş Adresim",
    fullName: "Zeynep Yılmaz",
    phone: "05321234567",
    city: "İstanbul",
    district: "Şişli",
    fullAddress: "Mecidiyeköy Mah. Büyükdere Cad. No:100 Şişli/İstanbul",
    isDefault: false,
  },
  {
    userEmail: "ayse@example.com",
    title: "Ev Adresim",
    fullName: "Ayşe Demir",
    phone: "05339876543",
    city: "Ankara",
    district: "Çankaya",
    fullAddress: "Kızılay Mah. Atatürk Bulvarı No:50 D:8 Çankaya/Ankara",
    isDefault: true,
  },
  {
    userEmail: "elif@example.com",
    title: "Ev Adresim",
    fullName: "Elif Kaya",
    phone: "05441112233",
    city: "İzmir",
    district: "Karşıyaka",
    fullAddress: "Bostanlı Mah. 1234 Sok. No:7 K:3 D:5 Karşıyaka/İzmir",
    isDefault: true,
  },
]

export const testCoupons = [
  {
    code: "HOSGELDIN",
    discountType: "PERCENTAGE" as const,
    discountValue: 15,
    minAmount: 500,
    usageLimit: 100,
    usedCount: 5,
    expiresAt: new Date("2027-12-31"),
  },
  {
    code: "INDIRIM100",
    discountType: "FIXED" as const,
    discountValue: 100,
    minAmount: 500,
    usageLimit: 50,
    usedCount: 12,
    expiresAt: new Date("2027-06-30"),
  },
  {
    code: "KIS200",
    discountType: "FIXED" as const,
    discountValue: 200,
    minAmount: 1000,
    usageLimit: 30,
    usedCount: 3,
    expiresAt: new Date("2026-03-01"),
  },
  {
    code: "YENIYIL",
    discountType: "PERCENTAGE" as const,
    discountValue: 25,
    minAmount: 1000,
    usageLimit: 200,
    usedCount: 45,
    expiresAt: new Date("2027-01-05"),
  },
]

export const testDropshippers = [
  {
    name: "Lojitek Tekstil",
    xmlFeedUrl: "https://www.lojitek.com.tr/feed/xml",
    orderEndpoint: "https://www.lojitek.com.tr/api/orders",
    apiKey: "lojitek_api_key_123",
    apiPassword: "lojitek_pass_456",
    isActive: true,
  },
  {
    name: "ModaTedarik A.Ş.",
    xmlFeedUrl: "https://www.modatedarik.com/xml/urunler.xml",
    orderEndpoint: "https://api.modatedarik.com/v1/siparis",
    apiKey: "mt_api_key_789",
    apiPassword: "mt_pass_012",
    isActive: true,
  },
]
