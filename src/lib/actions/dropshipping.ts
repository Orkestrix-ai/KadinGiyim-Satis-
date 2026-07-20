"use server"

import { revalidatePath } from "next/cache"

export async function createDropshipper(_formData: FormData) {
  revalidatePath("/admin/dropshipping")
}

export async function updateDropshipper(_id: string, _formData: FormData) {
  revalidatePath("/admin/dropshipping")
}

export async function deleteDropshipper(_id: string) {
  revalidatePath("/admin/dropshipping")
}

export async function importDropshipperProducts(_dropshipperId: string) {
  return { imported: 0, skipped: 0, total: 0 }
}

export async function forwardOrderToDropshipper(_dropshipperId: string, _orderId: string) {
  return { status: "SKIPPED" as const, supplierOrderId: null, errorMessage: null }
}

type Dropshipper = {
  id: string; name: string; xmlFeedUrl: string; orderEndpoint: string | null
  apiKey: string | null; apiPassword: string | null; createdAt: Date; isActive: boolean
  productMappings: Array<{ id: string; supplierProductId: string; supplierPrice: number | null; lastSyncAt: Date | null; product: { id: string; name: string; slug: string; price: number } }>
  orderRecords: Array<{ id: string; orderId: string; supplierOrderId: string | null; createdAt: Date; status: string; errorMessage: string | null; order: { id: string; total: number; status: string } }>
  _count: { productMappings: number; orderRecords: number }
}

type DropshipperOrder = {
  id: string; orderId: string; status: string; createdAt: Date
  supplierOrderId: string | null; errorMessage: string | null
  dropshipper: { name: string }
  order: { id: string; total: number; status: string }
}

type UnforwardedOrder = {
  id: string; status: string; total: number; shippingName: string; createdAt: Date
  items: Array<{ variant: { productId: string } }>
  user: { name: string | null; email: string }
}

export async function getDropshippers(): Promise<Dropshipper[]> {
  return []
}

export async function getDropshipper(_id: string): Promise<Dropshipper | null> {
  return null
}

export async function getDropshipperOrders(_dropshipperId?: string): Promise<DropshipperOrder[]> {
  return []
}

export async function getUnforwardedOrders(): Promise<UnforwardedOrder[]> {
  return []
}
