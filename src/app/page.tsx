import Link from "next/link";

const SECTIONS = [
  {
    href: "/boards/free",
    title: "자유게시판",
    description: "자동차에 관한 자유로운 이야기를 나눠보세요.",
  },
  {
    href: "/boards",
    title: "차종별 게시판",
    description: "내 차종 사람들과 정보를 공유하세요.",
  },
  {
    href: "/market",
    title: "중고차/부품 거래",
    description: "중고차와 부품을 사고팔아보세요.",
  },
  {
    href: "/news",
    title: "신차정보",
    description: "최신 신차 출시 소식을 확인하세요.",
  },
];

export default function Home() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">자동차 커뮤니티에 오신 것을 환영합니다</h1>
      <p className="mb-8 text-black/60 dark:text-white/60">
        자동차를 좋아하는 사람들이 모여 정보를 나누고 거래하는 공간입니다.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-lg border border-black/10 p-5 transition hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
          >
            <h2 className="mb-1 font-semibold">{section.title}</h2>
            <p className="text-sm text-black/60 dark:text-white/60">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
