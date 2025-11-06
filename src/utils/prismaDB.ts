// Este arquivo só deve ser usado se DATABASE_URL estiver configurado
// Durante o build na Vercel sem DATABASE_URL, este arquivo não deve ser executado

let PrismaClient: any;
let prismaInstance: any;

// Só importa PrismaClient se DATABASE_URL estiver configurado
if (process.env.DATABASE_URL) {
  try {
    PrismaClient = require("@prisma/client").PrismaClient;
    
    const globalForPrisma = global as unknown as { prisma: any };
    
    prismaInstance =
      globalForPrisma.prisma ||
      new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query"] : [],
      });

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prismaInstance;
    }
  } catch (error) {
    // Se não conseguir importar Prisma, continua sem ele
    console.warn("Prisma não disponível");
  }
}

export const prisma = prismaInstance;