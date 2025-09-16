import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { prisma } from "./prismaDB";
import type { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin",
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Jhondoe" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text", placeholder: "Jhon Doe" },
      },

      async authorize(credentials) {
        console.log(credentials);
        // check to see if email and password is there
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email or password");
        }

        try {
          console.log("🔍 Iniciando autenticação...");
          console.log("📧 Email:", credentials.email);
          console.log("🌐 API URL:", process.env.NEXT_PUBLIC_API_URL);
          
          const apiUrl = 'https://localhost:7000/api/';
          const loginUrl = `${apiUrl}Auth/login`;
          console.log("🔗 URL completa:", loginUrl);
          
          // Usar axios que funciona melhor com SSL
          const axios = require('axios');
          
          console.log("🚀 Fazendo requisição para:", loginUrl);
          
          const response = await axios.post(loginUrl, {
            email: credentials.email,
            password: credentials.password,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
            httpsAgent: new (require('https').Agent)({
              rejectUnauthorized: false
            })
          });

          console.log("📡 Response status:", response.status);
          console.log("📡 Response data:", response.data);
          
          const userData = response.data;
          
          // Retorna o usuário no formato esperado pelo NextAuth
          return {
            id: userData.user.id,
            email: userData.user.email,
            name: userData.user.name,
            image: userData.user.image || null,
            accessToken: userData.token, // Token da sua API
            refreshToken: null, // Sua API não retorna refresh token
            roles: userData.user.roles, // Roles do usuário
            expiresAt: userData.expiresAt, // Data de expiração
          };
        } catch (error: any) {
          console.error("Erro na autenticação:", error);
          
          if (error.response) {
            // Erro da API
            const errorMessage = error.response.data?.message || "Invalid email or password";
            throw new Error(errorMessage);
          } else if (error.request) {
            // Erro de rede
            throw new Error("Erro de conexão com o servidor");
          } else {
            // Outro erro
            throw new Error(error.message || "Erro desconhecido");
          }
        }
      },
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],

  callbacks: {
    jwt: async (payload: any) => {
      console.log("jwt");
      console.log(payload);
      const { token } = payload;
      const user = payload.user;

      if (user) {
        return {
          ...token,
          id: user.id,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          roles: user.roles,
          expiresAt: user.expiresAt,
        };
      }
      return token;
    },

    session: async ({ session, token }) => {
      if (session?.user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token?.id,
          },
          accessToken: token?.accessToken,
          refreshToken: token?.refreshToken,
          roles: token?.roles,
          expiresAt: token?.expiresAt,
        };
      }
      return session;
    },
  },

  // debug: process.env.NODE_ENV === "developement",
};
