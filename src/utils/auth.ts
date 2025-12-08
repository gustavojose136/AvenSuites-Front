import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import axios from "axios";
import https from "https";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.SECRET,
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Por favor, insira seu e-mail e senha");
        }

        try {
          const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://api-avensuits.azurewebsites.net/api').replace(/\/$/, '');
          const loginEndpoint = '/Auth/login';
          const fullUrl = `${apiUrl}${loginEndpoint}`;

          const axiosConfig: any = {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 10000,
          };

          if (process.env.NODE_ENV === 'development') {
            const httpsAgent = new https.Agent({
              rejectUnauthorized: false
            });
            axiosConfig.httpsAgent = httpsAgent;
          }

          const response = await axios.post(fullUrl, {
            email: credentials.email,
            password: credentials.password,
          }, axiosConfig);

          const userData = response.data;

          const user = {
            id: userData.user?.id || userData.id || "unknown",
            email: userData.user?.email || userData.email || credentials.email,
            name: userData.user?.name || userData.name || credentials.email.split('@')[0],
            image: userData.user?.image || userData.image || null,
            accessToken: userData.token || userData.accessToken,
            refreshToken: userData.refreshToken || null,
            roles: userData.user?.roles || userData.roles || [],
            expiresAt: userData.expiresAt || null,
          };

          return user;

        } catch (error: any) {
          console.error("❌ ============================================");
          console.error("❌ ERRO NA AUTENTICAÇÃO");
          console.error("❌ ============================================");

          if (error.response) {
            console.error("📡 Status:", error.response.status);
            console.error("📡 Dados:", error.response.data);
            console.error("📡 Headers:", error.response.headers);

            const errorMessage = error.response.data?.message
              || error.response.data?.error
              || error.response.data?.title
              || "E-mail ou senha inválidos";

            throw new Error(errorMessage);

          } else if (error.request) {
            console.error("📡 Request feito mas sem resposta");
            console.error("📡 Request:", error.request);
            throw new Error("Erro de conexão com o servidor. Verifique se a API está rodando em: " + (process.env.NEXT_PUBLIC_API_URL || 'https://api-avensuits.azurewebsites.net/api'));

          } else if (error.code === 'ECONNREFUSED') {
            console.error("📡 Conexão recusada");
            throw new Error("Não foi possível conectar ao servidor. Verifique se a API está ativa.");

          } else if (error.code === 'ENOTFOUND') {
            console.error("📡 Host não encontrado");
            throw new Error("Servidor não encontrado. Verifique a URL da API.");

          } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
            console.error("📡 Timeout");
            throw new Error("Tempo de conexão esgotado. A API demorou muito para responder.");

          } else {
            console.error("📡 Erro desconhecido:", error.message);
            console.error("📡 Stack:", error.stack);
            throw new Error(error.message || "Erro ao fazer login. Tente novamente.");
          }
        }
      },
    }),

    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),

    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    ...(process.env.EMAIL_SERVER_HOST &&
    process.env.EMAIL_SERVER_PORT &&
    process.env.EMAIL_SERVER_USER &&
    process.env.EMAIL_SERVER_PASSWORD &&
    process.env.EMAIL_FROM
      ? [
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
        ]
      : []),
  ],

  callbacks: {
    jwt: async (payload: any) => {
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

};
