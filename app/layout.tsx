import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeModeScript } from "flowbite-react";
import "./globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quindart portfolio",
  description:
    " Liên hệ ngay để hợp tác phát triển sản phẩm công nghệ chất lượng",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <head>
        <ThemeModeScript />
      </head>
      <body className={`${inter.className} h-full min-h-screen`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
