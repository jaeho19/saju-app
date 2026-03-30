'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { FiveElementsAnalysis, FiveElement } from '@/types/saju'

interface FiveElementsChartProps {
  readonly analysis: FiveElementsAnalysis
}

const ELEMENT_COLORS: Record<FiveElement, string> = {
  '목': '#4a9c5d',
  '화': '#e74c3c',
  '토': '#d4a017',
  '금': '#bdc3c7',
  '수': '#3498db',
}

const ELEMENT_LABELS: readonly FiveElement[] = ['목', '화', '토', '금', '수']

interface ChartDataItem {
  readonly name: FiveElement
  readonly value: number
  readonly percentage: number
  readonly color: string
}

function buildChartData(analysis: FiveElementsAnalysis): readonly ChartDataItem[] {
  return ELEMENT_LABELS.map((element) => ({
    name: element,
    value: analysis.distribution[element],
    percentage: analysis.percentage[element],
    color: ELEMENT_COLORS[element],
  }))
}

interface CustomTooltipProps {
  readonly active?: boolean
  readonly payload?: readonly { readonly payload: ChartDataItem }[]
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const data = payload[0].payload
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-[var(--color-gold-light)]/40">
      <p className="text-sm font-medium" style={{ color: data.color }}>
        {data.name} {data.value}개 ({data.percentage}%)
      </p>
    </div>
  )
}

export default function FiveElementsChart({ analysis }: FiveElementsChartProps) {
  const chartData = buildChartData(analysis)

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-lg font-bold text-[var(--color-dark)]">오행 분포</h2>

      <div className="w-full max-w-xs h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData as ChartDataItem[]}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {chartData.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-[var(--color-gold-light)]/30"
          >
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs font-medium text-[var(--color-dark)]">
              {item.name}
            </span>
            <span className="text-xs text-[var(--color-dark)]/60">
              {item.value} ({item.percentage}%)
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-4 text-sm">
        <span className="text-[var(--color-dark)]/70">
          강한 오행: <strong className="text-[var(--color-dark)]">{analysis.dominant}</strong>
        </span>
        {analysis.lacking.length > 0 && (
          <span className="text-[var(--color-dark)]/70">
            부족한 오행: <strong className="text-[var(--color-fire)]">{analysis.lacking.join(', ')}</strong>
          </span>
        )}
      </div>
    </div>
  )
}
