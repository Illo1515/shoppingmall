import Providers from "@/components/Providers";
import Header from "@/components/Header";
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
          <footer className="py-10 text-center text-[var(--color-toss-gray-500)] text-sm mt-auto">
            © 2026 Ojeommu Corporation. All rights reserved.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
