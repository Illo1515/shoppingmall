import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Toss Shopping Store",
  description: "A clean, minimalist e-commerce store with Toss UI aesthetics.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-blue-200">
        <Providers>
          <Header />
          <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-5 py-8">
            {children}
          </main>
          <footer className="py-8 mt-auto px-5 border-t border-[var(--color-toss-gray-100)]">
            <div className="max-w-5xl mx-auto w-full flex items-center justify-center relative">
              <p className="text-[var(--color-toss-gray-500)] text-sm">© 2026 Ojeommu Corporation. All rights reserved.</p>
              <Link href="/admin/login" className="absolute right-0 text-[var(--color-toss-gray-400)] hover:text-[var(--color-toss-gray-800)] text-xs transition-colors underline-offset-4 hover:underline">
                관리자 로그인
              </Link>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
