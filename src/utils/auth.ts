import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import type { Adapter } from "next-auth/adapters";
import axios from "axios";
import https from "https";

// Importa Prisma apenas se DATABASE_URL estiver configurado
// Como estamos usando JWT strategy, não precisamos do adapter se não houver banco
let adapter: Adapter | undefined = undefined;

// Só tenta usar Prisma se DATABASE_URL estiver configurado
if (process.env.DATABASE_URL) {
  try {
    // Importação dinâmica para evitar erros durante o build se Prisma não estiver disponível
    const prismaModule = require("./prismaDB");
    const adapterModule = require("@auth/prisma-adapter");
    if (prismaModule?.prisma && adapterModule?.PrismaAdapter) {
      adapter = adapterModule.PrismaAdapter(prismaModule.prisma) as Adapter;
    }
  } catch (error) {
    // Se não conseguir importar Prisma, continua sem adapter
    // Isso é normal se não estiver usando banco de dados local
    console.warn("Prisma não disponível, usando autenticação JWT sem banco de dados");
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin",
  },
  adapter: adapter,
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
        console.log("\n");
        console.log("🔐 ================================================");
        console.log("🔐 ATENÇÃO: AUTENTICAÇÃO VIA API EXTERNA");
        console.log("🔐 NextAuth está apenas criando a sessão!");
        console.log("🔐 A validação é feita na SUA API em C#");
        console.log("🔐 ================================================");
        
        // Validação dos campos obrigatórios
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Por favor, insira seu e-mail e senha");
        }

        try {
          // Remove barra final da API URL se existir
          const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7000/api').replace(/\/$/, '');
          const loginEndpoint = '/Auth/login';
          const fullUrl = `${apiUrl}${loginEndpoint}`;
          
          console.log("\n📡 FAZENDO CHAMADA PARA SUA API EXTERNA:");
          console.log("   📧 Email:", credentials.email);
          console.log("   🌐 API URL:", apiUrl);
          console.log("   🔗 Endpoint Completo:", fullUrl);
          console.log("   ⚙️  Método: POST");
          console.log("   📦 Body:", JSON.stringify({ email: credentials.email, password: "***" }));
          console.log("\n⏳ Aguardando resposta da API...");
          
          // Cria um agente HTTPS que ignora certificados SSL em desenvolvimento
          const httpsAgent = new https.Agent({
            rejectUnauthorized: false
          });

          // Faz a requisição usando Axios (funciona melhor com HTTPS)
          const response = await axios.post(fullUrl, {
            email: credentials.email,
            password: credentials.password,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
            httpsAgent: httpsAgent, // Ignora SSL em desenvolvimento
            timeout: 10000, // Timeout de 10 segundos
          });

          console.log("\n✅ ================================================");
          console.log("✅ RESPOSTA RECEBIDA DA SUA API!");
          console.log("✅ ================================================");
          console.log("📡 Status HTTP:", response.status);
          console.log("📦 Dados recebidos da API:");
          console.log(JSON.stringify(response.data, null, 2));
          console.log("✅ ================================================\n");
          
          const userData = response.data;
          
          // Estrutura da resposta esperada da API:
          // {
          //   token: "JWT_TOKEN",
          //   user: {
          //     id: "user_id",
          //     email: "user@email.com",
          //     name: "User Name",
          //     roles: ["ADMIN", "USER"],
          //     image?: "url"
          //   },
          //   expiresAt?: "2024-12-31T23:59:59Z"
          // }
          
          // Retorna o usuário no formato esperado pelo NextAuth
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

          console.log("💾 Salvando na sessão do NextAuth:");
          console.log(JSON.stringify(user, null, 2));
          console.log("\n🎉 AUTENTICAÇÃO CONCLUÍDA VIA SUA API!\n");
          
          return user;
          
        } catch (error: any) {
          console.error("❌ ============================================");
          console.error("❌ ERRO NA AUTENTICAÇÃO");
          console.error("❌ ============================================");
          
          // Erros do Axios
          if (error.response) {
            // A API respondeu com um status de erro
            console.error("📡 Status:", error.response.status);
            console.error("📡 Dados:", error.response.data);
            console.error("📡 Headers:", error.response.headers);
            
            const errorMessage = error.response.data?.message 
              || error.response.data?.error 
              || error.response.data?.title
              || "E-mail ou senha inválidos";
            
            throw new Error(errorMessage);
            
          } else if (error.request) {
            // A requisição foi feita mas não houve resposta
            console.error("📡 Request feito mas sem resposta");
            console.error("📡 Request:", error.request);
            throw new Error("Erro de conexão com o servidor. Verifique se a API está rodando em: " + (process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7000/api'));
            
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
            // Outro erro
            console.error("📡 Erro desconhecido:", error.message);
            console.error("📡 Stack:", error.stack);
            throw new Error(error.message || "Erro ao fazer login. Tente novamente.");
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
