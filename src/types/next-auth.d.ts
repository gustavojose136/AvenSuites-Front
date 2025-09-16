import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    refreshToken?: string
    roles?: string[]
    expiresAt?: string
  }

  interface JWT {
    accessToken?: string
    refreshToken?: string
    roles?: string[]
    expiresAt?: string
  }
}
