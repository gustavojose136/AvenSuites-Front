import "@/styles/index.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from 'react-hot-toast';
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AvenSuites - Sistema de Gestão Hoteleira Completo",
  description: "Plataforma moderna e completa para gestão de hotéis, reservas, quartos e hóspedes. Simplifique sua operação hoteleira com o AvenSuites.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} dark:bg-dark`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '10px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
