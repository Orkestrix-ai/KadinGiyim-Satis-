import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email = credentials.email as string
        const password = credentials.password as string

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return null

        return { id: user.id, email: user.email, name: user.name, image: user.image }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
        token.role = dbUser?.role ?? "USER"
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  session: { strategy: "jwt" },
})
