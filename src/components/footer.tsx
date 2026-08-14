export function Footer() {
  return (
    <footer className="mt-auto border-t border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-black/60 dark:text-white/60">
        © {new Date().getFullYear()} 자동차 커뮤니티. All rights reserved.
      </div>
    </footer>
  );
}
