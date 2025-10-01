/* eslint-disable @next/next/no-document-import-in-page */
import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeModeScript } from "flowbite-react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import MainBottomNavigation from "@/components/shared/MainBottomNavigation";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Quindart portfolio",
  description:
    "Liên hệ ngay để hợp tác phát triển sản phẩm công nghệ chất lượng",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="preconnect" href="https://fonts.google.com" />
      <link rel="preconnect" href="https://cloudinary.com" />
      <head>
        <ThemeModeScript />
      </head>
      <body className={`${inter.className} mb-10 h-full min-h-screen`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function loadCSS(href) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = href;
                document.head.appendChild(link);
              }
              window.addEventListener('load', () => {
                loadCSS('/non-critical.css');
              });
            `,
          }}
        />
        <Header />
        {children}
        <Footer />
        <MainBottomNavigation />
      </body>
    </html>
  );
}
