"use client"

import { signIn } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

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
      await signIn("credentials", { email, password, redirectTo: "/" })
    } else {
      const name = form.get("name") as string
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      if (res.ok) {
        await signIn("credentials", { email, password, redirectTo: "/" })
      }
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{isLogin ? "Giriş Yap" : "Kayıt Ol"}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isLogin ? "Hesabınıza giriş yapın" : "Yeni hesap oluşturun"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Ad Soyad
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg text-sm"
              placeholder="Ad Soyad"
            />
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            E-posta
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder="ornek@email.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Şifre
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          {isLogin ? "Giriş Yap" : "Kayıt Ol"}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">veya</span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => signIn("google", { redirectTo: "/" })}
          className="w-full py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
        >
          Google ile Devam Et
        </button>
        <button
          onClick={() => signIn("facebook", { redirectTo: "/" })}
          className="w-full py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
        >
          Facebook ile Devam Et
        </button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {isLogin ? "Hesabınız yok mu?" : "Zaten hesabınız var mı?"}{" "}
        <button
          onClick={() => router.push(isLogin ? "/register" : "/login")}
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          {isLogin ? "Kayıt Ol" : "Giriş Yap"}
        </button>
      </p>
    </div>
  )
}
