"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { LogIn, LogOut, Settings, ShoppingBag } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();
  
  // 간단한 어드민 확인 (토스 이메일이거나 특정 계정일 경우, 여기선 단순화)
  const isAdmin = session?.user?.email; // 모든 로그인 사용자에 일단 어드민 버튼 노출 (추후 제어)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--color-toss-gray-200)]">
      <div className="max-w-5xl mx-auto w-full px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ShoppingBag className="w-7 h-7 text-[var(--color-toss-blue)]" />
          <span className="font-bold text-xl tracking-tight text-[var(--color-toss-gray-900)]">토스쇼핑</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-[var(--color-toss-gray-700)] hidden sm:block">
                <span className="font-semibold text-black">{session.user.name}</span>님
              </span>
              
              {isAdmin && (
                <Link href="/admin" className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-toss-gray-600)] hover:text-black transition-colors bg-[var(--color-toss-gray-100)] py-1.5 px-3 rounded-full">
                  <Settings className="w-4 h-4" />
                  관리자
                </Link>
              )}
              
              <button 
                onClick={() => signOut()}
                className="flex items-center justify-center p-2 rounded-full hover:bg-[var(--color-toss-gray-100)] text-[var(--color-toss-gray-600)] transition-colors"
                title="로그아웃"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => signIn('google')}
              className="flex items-center gap-2 text-sm font-semibold bg-[var(--color-toss-gray-100)] text-[var(--color-toss-gray-800)] py-2 px-4 rounded-full hover:bg-[var(--color-toss-gray-200)] transition-colors"
            >
              <LogIn className="w-4 h-4" />
              구글로 시작하기
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
