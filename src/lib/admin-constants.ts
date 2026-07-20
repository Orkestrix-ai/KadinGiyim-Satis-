export const statusLabels: Record<string, string> = {
  PENDING: "Bekliyor",
  PROCESSING: "Hazırlanıyor",
  SHIPPED: "Kargoda",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
}

export const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
}

export const navItems = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/products", label: "Ürünler", icon: "⊞" },
  { href: "/admin/orders", label: "Siparişler", icon: "⊟" },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: "⊡" },
  { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: "⊛" },
  { href: "/admin/coupons", label: "Kuponlar", icon: "⊜" },
  { href: "/admin/dropshipping", label: "XML Dropshipping", icon: "⇄" },
]

export const mobileNavItems = navItems.map(({ href, label }) => ({ href, label }))

export const orderStatusOptions = [
  { value: "PENDING", label: "Bekliyor" },
  { value: "PROCESSING", label: "Hazırlanıyor" },
  { value: "SHIPPED", label: "Kargoda" },
  { value: "DELIVERED", label: "Teslim Edildi" },
  { value: "CANCELLED", label: "İptal Edildi" },
]

export function formatDate(date: Date): string {
  return date.toLocaleDateString("tr-TR")
}

export function formatDateTime(date: Date): string {
  return date.toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}
