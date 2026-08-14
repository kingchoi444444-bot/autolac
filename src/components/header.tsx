"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const NAV_LINKS = [
  { href: "/boards/free", label: "자유게시판" },
  { href: "/boards", label: "차종별 게시판" },
  { href: "/market", label: "중고차/부품 거래" },
  { href: "/news", label: "신차정보" },
];

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold">
          자동차 커뮤니티
        </Link>

        <nav className="hidden gap-5 text-sm sm:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {status === "authenticated" ? (
            <>
              <span>{session.user?.name}님</span>
              <button onClick={() => signOut()} className="hover:underline">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                로그인
              </Link>
              <Link href="/register" className="hover:underline">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
