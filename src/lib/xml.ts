export function extractProductsFromFeed(_xml: string): { supplierId?: string; name?: string; description?: string; price?: number; image?: string; images?: string[]; category?: string; size?: string; color?: string; stock?: number }[] {
  return []
}

export function buildOrderXml(_data: Record<string, unknown>): string {
  return "<order></order>"
}

export function parseXml(_xml: string): Record<string, unknown> {
  return {}
}
