import Link from 'next/link'
import MobileLayout from '@/components/layout/mobile-layout'

interface ServiceCard {
  readonly href: string
  readonly icon: string
  readonly title: string
  readonly description: string
}

const SERVICE_CARDS: readonly ServiceCard[] = [
  {
    href: '/saju',
    icon: '🔮',
    title: '사주팔자',
    description: '생년월일시 기반 사주 분석',
  },
  {
    href: '/compatibility',
    icon: '💕',
    title: '궁합 분석',
    description: '두 사람의 사주 궁합 확인',
  },
  {
    href: '/fortune',
    icon: '⭐',
    title: '오늘의 운세',
    description: '맞춤형 일일 운세 확인',
  },
  {
    href: '/chat',
    icon: '💬',
    title: 'AI 상담',
    description: 'AI 사주 전문가와 상담',
  },
] as const

export default function HomePage() {
  return (
    <MobileLayout>
      <section className="flex flex-col items-center text-center pt-8 pb-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] bg-clip-text text-transparent leading-tight">
          당신의 사주를
          <br />
          알아보세요
        </h1>
        <p className="mt-3 text-sm text-[var(--color-dark)]/60 leading-relaxed">
          전통 사주명리학 기반 AI 맞춤형 운세
        </p>
        <Link
          href="/saju"
          className="mt-6 inline-flex items-center justify-center px-8 py-3 rounded-full bg-[var(--color-gold)] text-white font-semibold text-base shadow-lg hover:opacity-90 transition-opacity"
        >
          무료 사주 보기
        </Link>
      </section>

      <section className="grid grid-cols-2 gap-3 pb-8">
        {SERVICE_CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-white shadow-sm border border-[var(--color-gold-light)]/30 hover:shadow-md hover:border-[var(--color-gold)]/40 transition-all"
          >
            <span className="text-3xl">{card.icon}</span>
            <span className="text-sm font-bold text-[var(--color-dark)]">
              {card.title}
            </span>
            <span className="text-xs text-[var(--color-dark)]/50 leading-snug text-center">
              {card.description}
            </span>
          </Link>
        ))}
      </section>
    </MobileLayout>
  )
}
