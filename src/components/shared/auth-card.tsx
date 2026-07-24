"use client"

import { useActionState, useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, User, Loader2 } from "lucide-react"
import { login } from "@/lib/actions"

interface AuthCardProps {
  mode: "login" | "register"
}

export function AuthCard({ mode }: AuthCardProps) {
  const router = useRouter()
  const isLogin = mode === "login"
  const [loginError, formAction, isPending] = useActionState(login, undefined)
  const [registerError, setRegisterError] = useState("")
  const [registering, setRegistering] = useState(false)

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setRegisterError("")
    setRegistering(true)

    const form = new FormData(e.currentTarget)
    const name = form.get("name") as string
    const email = form.get("email") as string
    const password = form.get("password") as string

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      setRegisterError(data.error ?? "Kayıt sırasında bir hata oluştu")
      setRegistering(false)
      return
    }

    setRegistering(false)
    const loginForm = new FormData()
    loginForm.append("email", email)
    loginForm.append("password", password)
    formAction(loginForm)
  }

  const error = loginError ?? registerError
  const loading = isPending || registering

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="border rounded-2xl p-8 bg-card shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold">{isLogin ? "Giriş Yap" : "Kayıt Ol"}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLogin ? "Hesabınıza giriş yapın" : "Yeni hesap oluşturun"}
          </p>
        </div>

        <form action={isLogin ? formAction : undefined} onSubmit={isLogin ? undefined : handleRegister} className="space-y-4">
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
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "İşleniyor..." : isLogin ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </form>

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
