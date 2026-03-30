import MobileLayout from '@/components/layout/mobile-layout'

export default function LoginPage() {
  return (
    <MobileLayout>
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-2xl font-bold text-[var(--color-dark)]">로그인</h1>
        <p className="mt-2 text-sm text-[var(--color-dark)]/50">
          간편하게 로그인하고 사주를 저장하세요
        </p>

        <div className="mt-10 w-full max-w-xs space-y-3">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-[var(--color-dark)] font-medium text-sm shadow-sm border border-[var(--color-dark)]/10 hover:bg-[var(--color-cream)] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
              />
            </svg>
            Google로 로그인
          </button>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[#FEE500] text-[#191919] font-medium text-sm shadow-sm hover:opacity-90 transition-opacity"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#191919"
                d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67l-1.18 4.37c-.1.36.32.65.62.44l5.02-3.34c.29.02.58.04.88.04 5.52 0 10-3.58 10-7.94S17.52 3 12 3Z"
              />
            </svg>
            카카오로 로그인
          </button>
        </div>
      </div>
    </MobileLayout>
  )
}
