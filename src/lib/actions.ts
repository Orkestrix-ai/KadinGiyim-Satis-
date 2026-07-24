"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

export async function login(prev: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: "/admin",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return "E-posta veya şifre hatalı"
    }
    throw error
  }
}
