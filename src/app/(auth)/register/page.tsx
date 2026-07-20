import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AuthCard } from "@/components/shared/auth-card"

export default async function RegisterPage() {
  const session = await auth()
  if (session) redirect("/")

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <AuthCard mode="register" />
    </div>
  )
}
