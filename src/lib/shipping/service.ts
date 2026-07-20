interface CargoRequest {
  orderId: string
  receiverName: string
  receiverPhone: string
  receiverCity: string
  receiverDistrict: string
  receiverAddress: string
  packageCount: number
  weight: number
}

interface CargoResult {
  success: boolean
  trackingCode?: string
  error?: string
}

export async function createCargoShipment(request: CargoRequest): Promise<CargoResult> {
  try {
    const apiKey = process.env.CARGO_API_KEY
    const apiUrl = process.env.CARGO_API_URL

    if (!apiKey || !apiUrl) {
      return { success: false, error: "Kargo servisi yapılandırılmamış" }
    }

    const body = {
      invoiceKey: `INV-${request.orderId}`,
      receiverName: request.receiverName,
      receiverPhone: request.receiverPhone,
      city: request.receiverCity,
      district: request.receiverDistrict,
      address: request.receiverAddress,
      packageCount: request.packageCount,
      weight: request.weight,
      cargoType: "STANDART",
    }

    const response = await fetch(`${apiUrl}/api/shipments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })

    const result = await response.json()

    if (response.ok) {
      return { success: true, trackingCode: result.trackingCode ?? result.trackingNumber }
    }

    return { success: false, error: result.message ?? "Kargo oluşturulamadı" }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Kargo servis hatası" }
  }
}

export function generateTrackingCode(orderId: string): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `MCN${timestamp}${random}`
}

export function getTrackingUrl(company: string, trackingCode: string): string {
  const urls: Record<string, string> = {
    YURTICI: `https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=${trackingCode}`,
    MNG: `https://www.mngkargo.com.tr/gonderi-takibi/${trackingCode}`,
    ARAS: `https://www.araskargo.com.tr/gonderi-takibi?code=${trackingCode}`,
    PTT: `https://gonderitakip.ptt.gov.tr/gonderi/${trackingCode}`,
  }
  return urls[company] ?? "#"
}
