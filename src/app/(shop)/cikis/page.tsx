"use client"

import { signOut } from "@/lib/auth-client"
import { useEffect } from "react"

export default function LogoutPage() {
  useEffect(() => {
    signOut({ redirectTo: "/" })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Çıkış yapılıyor...</p>
    </div>
  )
}
