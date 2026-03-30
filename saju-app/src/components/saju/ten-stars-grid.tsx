import type { TenStarAnalysis, FiveElement } from '@/types/saju'

interface TenStarsGridProps {
  readonly analysis: TenStarAnalysis
}

const ELEMENT_BG: Record<FiveElement, string> = {
  '목': 'bg-[var(--color-wood)]/15',
  '화': 'bg-[var(--color-fire)]/15',
  '토': 'bg-[var(--color-earth)]/15',
  '금': 'bg-[var(--color-metal)]/15',
  '수': 'bg-[var(--color-water)]/15',
}

const ELEMENT_TEXT: Record<FiveElement, string> = {
  '목': 'text-[var(--color-wood)]',
  '화': 'text-[var(--color-fire)]',
  '토': 'text-[var(--color-earth)]',
  '금': 'text-[var(--color-metal)]',
  '수': 'text-[var(--color-water)]',
}

const ELEMENT_BORDER: Record<FiveElement, string> = {
  '목': 'border-[var(--color-wood)]/30',
  '화': 'border-[var(--color-fire)]/30',
  '토': 'border-[var(--color-earth)]/30',
  '금': 'border-[var(--color-metal)]/30',
  '수': 'border-[var(--color-water)]/30',
}

export default function TenStarsGrid({ analysis }: TenStarsGridProps) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-[var(--color-dark)] text-center">십성 분석</h2>

      <div className="grid grid-cols-2 gap-2">
        {analysis.stars.map((entry) => (
          <div
            key={entry.position}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${ELEMENT_BG[entry.element]} ${ELEMENT_BORDER[entry.element]}`}
          >
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-[var(--color-dark)]/50 truncate">
                {entry.position}
              </span>
              <span className={`text-sm font-bold ${ELEMENT_TEXT[entry.element]}`}>
                {entry.star}
              </span>
            </div>
            <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${ELEMENT_BG[entry.element]} ${ELEMENT_TEXT[entry.element]}`}>
              {entry.element}
            </span>
          </div>
        ))}
      </div>

      {analysis.summary && (
        <p className="text-sm text-[var(--color-dark)]/70 leading-relaxed mt-1 px-1">
          {analysis.summary}
        </p>
      )}
    </div>
  )
}
