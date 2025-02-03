import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MetaPixel from '@/components/MetaPixel'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Futuros Tech | Aplicativo de Entradas para Trading',
  description: 'Aplicativo de Entradas com Relatórios de Alta Performance. Transforme seu investimento em resultados concretos com nosso aplicativo de recomendações.',
  keywords: 'aplicativo de trading, entradas de trading, recomendações de mercado, análise técnica, relatórios de trading, futuros tech',
  openGraph: {
    title: 'Futuros Tech | Aplicativo de Entradas para Trading',
    description: 'Aplicativo de Entradas com Relatórios de Alta Performance. Transforme seu investimento em resultados concretos.',
    url: 'https://futurostech.com',
    siteName: 'Futuros Tech',
    images: [
      {
        url: '/logo.jpg',
        width: 800,
        height: 600,
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: 'Futuros Tech | Aplicativo de Entradas para Trading',
    card: 'summary_large_image',
  },
  verification: {
    google: 'seu-código-de-verificação-aqui',
  },
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/logo.jpg" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <link rel="shortcut icon" href="/logo.jpg" />
        <link rel="canonical" href="https://futurostech.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <MetaPixel />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}