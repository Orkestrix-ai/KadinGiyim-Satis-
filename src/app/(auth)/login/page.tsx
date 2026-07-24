import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AuthCard } from "@/components/shared/auth-card"

export default async function LoginPage() {
  const session = await auth()
  const isAdmin = session?.user?.role === "ADMIN"
  if (session) redirect(isAdmin ? "/admin" : "/")

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Link href="/" className="font-heading text-3xl font-bold text-primary mb-8">
        Nevrak
      </Link>
      <AuthCard mode="login" />
    </div>
  )
}
