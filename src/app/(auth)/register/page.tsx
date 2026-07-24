import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AuthCard } from "@/components/shared/auth-card"

export default async function RegisterPage() {
  const session = await auth()
  if (session) redirect("/")

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Link href="/" className="font-heading text-3xl font-bold text-primary mb-8">
        Nevrak
      </Link>
      <AuthCard mode="register" />
    </div>
  )
}
