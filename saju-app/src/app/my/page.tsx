import Link from 'next/link'
import MobileLayout from '@/components/layout/mobile-layout'

interface MenuSection {
  readonly title: string
  readonly items: readonly MenuItem[]
}

interface MenuItem {
  readonly label: string
  readonly href: string
  readonly icon: string
}

const MENU_SECTIONS: readonly MenuSection[] = [
  {
    title: '저장된 프로필',
    items: [
      { label: '내 사주 프로필', href: '/my/profiles', icon: '👤' },
    ],
  },
  {
    title: '분석 기록',
    items: [
      { label: '사주 분석 기록', href: '/saju', icon: '🔮' },
      { label: '궁합 분석 기록', href: '/compatibility', icon: '💕' },
      { label: '운세 기록', href: '/fortune', icon: '⭐' },
    ],
  },
  {
    title: '설정',
    items: [
      { label: '알림 설정', href: '/my', icon: '🔔' },
      { label: '테마 설정', href: '/my', icon: '🎨' },
    ],
  },
] as const

export default function MyPage() {
  // Placeholder: not logged in state
  const isLoggedIn = false

  return (
    <MobileLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold text-center text-[var(--color-dark)]">
          마이페이지
        </h1>

        {!isLoggedIn && (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm border border-[var(--color-gold-light)]/30 text-center">
            <span className="text-4xl">👤</span>
            <h2 className="mt-3 text-base font-bold text-[var(--color-dark)]">
              로그인이 필요합니다
            </h2>
            <p className="mt-1 text-sm text-[var(--color-dark)]/50">
              로그인하면 분석 기록을 저장할 수 있습니다
            </p>
            <Link
              href="/login"
              className="mt-4 inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[var(--color-gold)] text-white font-semibold text-sm shadow-sm hover:opacity-90 transition-opacity"
            >
              로그인하기
            </Link>
          </div>
        )}

        <div className="mt-6 space-y-6">
          {MENU_SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="text-xs font-bold text-[var(--color-dark)]/40 uppercase tracking-wider mb-2 px-1">
                {section.title}
              </h2>
              <div className="rounded-2xl bg-white shadow-sm border border-[var(--color-gold-light)]/30 overflow-hidden divide-y divide-[var(--color-gold-light)]/20">
                {section.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--color-cream)] transition-colors"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="flex-1 text-sm font-medium text-[var(--color-dark)]">
                      {item.label}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-[var(--color-dark)]/30"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  )
}
