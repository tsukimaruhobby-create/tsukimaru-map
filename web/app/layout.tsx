import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

// 基本フォントの設定
const inter = Inter({ subsets: ["latin"] });

/**
 * サイトの基本情報（SEO設定）
 */
export const metadata: Metadata = {
  title: "月丸マップ",
  description: "日本全国のグルメと観光地を探せる検索サイト",
  openGraph: {
    title: "月丸マップ",
    description: "日本全国のグルメと観光地を探せる検索サイト",
    type: "website",
  },
};

/**
 * モバイル端末での表示設定
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
