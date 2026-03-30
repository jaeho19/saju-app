'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  readonly href: string
  readonly label: string
  readonly icon: string
}

const NAV_ITEMS: readonly NavItem[] = [
  { href: '/', label: '홈', icon: '🏠' },
  { href: '/saju', label: '사주', icon: '🔮' },
  { href: '/fortune', label: '운세', icon: '⭐' },
  { href: '/chat', label: '상담', icon: '💬' },
  { href: '/my', label: 'MY', icon: '👤' },
] as const

function isActive(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/'
  }
  return pathname.startsWith(href)
}

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-cream)] border-t border-[var(--color-gold-light)]/40">
      <div className="mx-auto max-w-lg flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1 rounded-lg transition-colors ${
                active
                  ? 'text-[var(--color-gold)]'
                  : 'text-[var(--color-dark)]/50 hover:text-[var(--color-dark)]/80'
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className={`text-[10px] font-medium ${active ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
