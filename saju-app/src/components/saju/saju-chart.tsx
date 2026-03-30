import type { SajuResult } from '@/types/saju'
import PillarCard from './pillar-card'

interface SajuChartProps {
  readonly result: SajuResult
}

export default function SajuChart({ result }: SajuChartProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="text-lg font-bold text-[var(--color-dark)]">사주팔자</h2>
      <div className="flex justify-center gap-2 sm:gap-4">
        {result.hourPillar ? (
          <PillarCard pillar={result.hourPillar} label="시주" />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-[var(--color-dark)]/60">시주</span>
            <div className="w-16 sm:w-20 rounded-xl border border-dashed border-[var(--color-gold-light)]/60 flex items-center justify-center h-[148px] sm:h-[172px]">
              <span className="text-xs text-[var(--color-dark)]/40 text-center leading-tight">
                시간<br />미상
              </span>
            </div>
          </div>
        )}
        <PillarCard pillar={result.dayPillar} label="일주" />
        <PillarCard pillar={result.monthPillar} label="월주" />
        <PillarCard pillar={result.yearPillar} label="연주" />
      </div>
    </div>
  )
}
