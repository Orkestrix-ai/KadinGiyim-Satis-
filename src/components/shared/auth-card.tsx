"use client"

import { signIn } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Mail, Lock, User } from "lucide-react"

interface AuthCardProps {
  mode: "login" | "register"
}

export function AuthCard({ mode }: AuthCardProps) {
  const router = useRouter()
  const isLogin = mode === "login"

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = form.get("email") as string
    const password = form.get("password") as string

    if (isLogin) {
      await signIn("credentials", { email, password, redirectTo: "/admin" })
    } else {
      const name = form.get("name") as string
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      if (res.ok) {
        await signIn("credentials", { email, password, redirectTo: "/admin" })
      }
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="border rounded-2xl p-8 bg-card shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold">{isLogin ? "Giriş Yap" : "Kayıt Ol"}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLogin ? "Hesabınıza giriş yapın" : "Yeni hesap oluşturun"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                Ad Soyad
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all placeholder:text-muted-foreground/60"
                  placeholder="Ad Soyad"
                />
              </div>
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              E-posta
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full pl-9 pr-3.5 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all placeholder:text-muted-foreground/60"
                placeholder="ornek@email.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
              Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full pl-9 pr-3.5 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all placeholder:text-muted-foreground/60"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] cursor-pointer"
          >
            {isLogin ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground">veya</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => signIn("google", { redirectTo: "/admin" })}
            className="w-full py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
          >
            Google ile Devam Et
          </button>
          <button
            onClick={() => signIn("facebook", { redirectTo: "/admin" })}
            className="w-full py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
          >
            Facebook ile Devam Et
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isLogin ? "Hesabınız yok mu?" : "Zaten hesabınız var mı?"}{" "}
          <button
            onClick={() => router.push(isLogin ? "/register" : "/login")}
            className="font-medium underline underline-offset-4 hover:text-primary cursor-pointer"
          >
            {isLogin ? "Kayıt Ol" : "Giriş Yap"}
          </button>
        </p>
      </div>
    </div>
  )
}
