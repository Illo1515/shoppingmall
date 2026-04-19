"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLoginAction } from "@/lib/auth-actions";
import Link from "next/link";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await adminLoginAction(username, password);

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-toss-gray-50)] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link 
          href="/" 
          className="inline-flex items-center text-[var(--color-toss-gray-600)] hover:text-[var(--color-toss-gray-900)] mb-8 transition-colors group"
        >
          <span className="mr-2">←</span>
          홈으로 돌아가기
        </Link>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
            🔒
          </div>
          
          <h1 className="text-3xl font-black text-[var(--color-toss-gray-900)] mb-2 tracking-tight">
            관리자 로그인
          </h1>
          <p className="text-[var(--color-toss-gray-500)] mb-10 font-medium">
            어드민 패널에 접근하기 위해 <br />인증 정보를 입력해주세요.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--color-toss-gray-700)] ml-1">
                아이디
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">👤</span>
                <input
                  type="text"
                  placeholder="아이디를 입력하세요"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[var(--color-toss-gray-100)] border-none rounded-2xl focus:ring-2 focus:ring-[var(--color-toss-blue)] transition-all outline-none text-[var(--color-toss-gray-900)] font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--color-toss-gray-700)] ml-1">
                비밀번호
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔒</span>
                <input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[var(--color-toss-gray-100)] border-none rounded-2xl focus:ring-2 focus:ring-[var(--color-toss-blue)] transition-all outline-none text-[var(--color-toss-gray-900)] font-medium"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium pt-2 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 mt-6 bg-[var(--color-toss-blue)] hover:bg-[#2069E6] text-white rounded-2xl font-bold text-lg transition-all shadow-[0_10px_20px_rgba(49,130,246,0.2)] flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                "..."
              ) : (
                "로그인하기"
              )}
            </button>
          </form>
        </div>
        
        <p className="mt-12 text-center text-[var(--color-toss-gray-400)] text-sm font-medium">
          © 2026 ijeommu Shopping Mall Admin. <br /> All rights reserved.
        </p>
      </div>
    </div>
  );
}
