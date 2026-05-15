import type { Metadata } from "next";
import { Archivo, Literata, Geist_Mono } from "next/font/google";
import Nav from "@/components/layout/Nav";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-structure",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const literata = Literata({
  variable: "--font-reading",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "optional",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Matheo Guevara",
  description: "Personal portfolio — Matheo Guevara",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${literata.variable} ${geistMono.variable}`}
    >
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
