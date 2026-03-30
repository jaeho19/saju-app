import type { Pillar, FiveElement } from '@/types/saju'

interface PillarCardProps {
  readonly pillar: Pillar
  readonly label: string
}

const ELEMENT_BG: Record<FiveElement, string> = {
  '목': 'bg-[var(--color-wood)]',
  '화': 'bg-[var(--color-fire)]',
  '토': 'bg-[var(--color-earth)]',
  '금': 'bg-[var(--color-metal)]',
  '수': 'bg-[var(--color-water)]',
}

const ELEMENT_BG_LIGHT: Record<FiveElement, string> = {
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

const YIN_YANG_SYMBOL: Record<string, string> = {
  '양': '☀',
  '음': '☽',
}

export default function PillarCard({ pillar, label }: PillarCardProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-medium text-[var(--color-dark)]/60">{label}</span>

      <div className="w-16 sm:w-20 rounded-xl overflow-hidden border border-[var(--color-gold-light)]/40 shadow-sm">
        <div className={`${ELEMENT_BG_LIGHT[pillar.stemElement]} px-2 py-2.5 flex flex-col items-center gap-0.5`}>
          <span className={`text-2xl sm:text-3xl font-bold ${ELEMENT_TEXT[pillar.stemElement]}`}>
            {pillar.stemHanja}
          </span>
          <span className="text-[11px] text-[var(--color-dark)]/70">
            {pillar.heavenlyStem}({pillar.stemElement})
          </span>
          <span className="text-[10px] text-[var(--color-dark)]/50">
            {YIN_YANG_SYMBOL[pillar.stemYinYang]} {pillar.stemYinYang}
          </span>
        </div>

        <div className="h-px bg-[var(--color-gold-light)]/30" />

        <div className={`${ELEMENT_BG_LIGHT[pillar.branchElement]} px-2 py-2.5 flex flex-col items-center gap-0.5`}>
          <span className={`text-2xl sm:text-3xl font-bold ${ELEMENT_TEXT[pillar.branchElement]}`}>
            {pillar.branchHanja}
          </span>
          <span className="text-[11px] text-[var(--color-dark)]/70">
            {pillar.earthlyBranch}({pillar.branchElement})
          </span>
          <span className="text-[10px] text-[var(--color-dark)]/50">
            {YIN_YANG_SYMBOL[pillar.branchYinYang]} {pillar.branchYinYang}
          </span>
        </div>
      </div>

      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${ELEMENT_BG[pillar.stemElement]} text-white`}>
        {pillar.tenStar}
      </span>
    </div>
  )
}
