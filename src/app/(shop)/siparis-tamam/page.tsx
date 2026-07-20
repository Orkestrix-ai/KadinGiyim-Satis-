import Link from "next/link"

export default async function OrderCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>
}) {
  const { id } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">Siparişiniz Alındı!</h1>
        <p className="text-muted-foreground mb-2">
          Siparişiniz başarıyla oluşturuldu. Sipariş numaranız:
        </p>
        <p className="text-lg font-semibold mb-6">{id}</p>
        <p className="text-sm text-muted-foreground mb-8">
          Sipariş durumunu profil sayfanızdan takip edebilirsiniz.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/profil/siparislerim"
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium"
          >
            Siparişlerim
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-lg border font-medium hover:bg-muted"
          >
            Ana Sayfa
          </Link>
        </div>
      </div>
    </div>
  )
}
