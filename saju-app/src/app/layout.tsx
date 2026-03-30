import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '사주팔자 - AI 사주 풀이',
  description: '전통 사주명리학 기반 AI 맞춤형 운세 해석 서비스',
  openGraph: {
    title: '사주팔자 - AI 사주 풀이',
    description: '전통 사주명리학 기반 AI 맞춤형 운세 해석 서비스',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="min-h-dvh bg-[var(--color-cream)] text-[var(--color-dark)]">
        <div className="mx-auto max-w-lg min-h-dvh flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
