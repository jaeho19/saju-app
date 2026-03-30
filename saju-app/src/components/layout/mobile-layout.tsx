import Header from './header'
import BottomNav from './bottom-nav'

interface MobileLayoutProps {
  readonly children: React.ReactNode
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <>
      <Header />
      <main className="flex-1 px-4 py-4 pb-20">
        {children}
      </main>
      <BottomNav />
    </>
  )
}
