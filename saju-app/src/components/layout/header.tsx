import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--color-cream)] border-b border-[var(--color-gold-light)]/40 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 h-14">
        <Link href="/" className="text-xl font-bold text-[var(--color-gold)]">
          사주팔자
        </Link>
        <Link
          href="/login"
          className="text-sm font-medium text-[var(--color-dark)]/70 hover:text-[var(--color-gold)] transition-colors"
        >
          로그인
        </Link>
      </div>
    </header>
  )
}
