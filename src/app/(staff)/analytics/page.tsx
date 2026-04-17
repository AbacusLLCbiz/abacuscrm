"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState, useCallback } from "react"
import {
  BarChart2,
  Globe,
  MousePointerClick,
  TrendingUp,
  Users,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrendPoint { date: string; pageviews: number }
interface TopPage { path: string; views: number }

interface OverviewData {
  days: number
  trend: TrendPoint[]
  totals: { pageviews: number; sessions: number }
  topPages: TopPage[]
}

// ─── SVG Area Chart ───────────────────────────────────────────────────────────

function AreaChart({ data }: { data: TrendPoint[] }) {
  const W = 900
  const H = 200
  const pad = { top: 16, right: 16, bottom: 36, left: 48 }
  const cw = W - pad.left - pad.right
  const ch = H - pad.top - pad.bottom

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] gap-3 text-[#94a3b8]">
        <BarChart2 className="h-8 w-8 text-[#cbd5e1]" />
        <p className="text-sm">No data yet — tracking starts automatically as visitors arrive</p>
      </div>
    )
  }

  const vals = data.map((d) => d.pageviews)
  const maxVal = Math.max(...vals, 1)
  const xStep = data.length > 1 ? cw / (data.length - 1) : cw

  const px = (i: number) => i * xStep
  const py = (v: number) => ch - (v / maxVal) * ch

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(1)},${py(d.pageviews).toFixed(1)}`).join(" ")
  const areaPath = `${linePath} L${px(data.length - 1).toFixed(1)},${ch} L0,${ch} Z`

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxVal * f))
  const labelStep = Math.max(1, Math.floor(data.length / 6))
  const xLabels = data
    .map((d, i) => ({ i, label: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) }))
    .filter((_, i) => i % labelStep === 0 || i === data.length - 1)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 200 }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e40af" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#1e40af" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g transform={`translate(${pad.left},${pad.top})`}>
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={0} y1={py(tick)} x2={cw} y2={py(tick)} stroke="#e2e8f0" strokeWidth="1" />
            <text x={-8} y={py(tick) + 4} textAnchor="end" fontSize={11} fill="#94a3b8">
              {tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : tick}
            </text>
          </g>
        ))}
        <path d={areaPath} fill="url(#areaGrad)" />
        <path d={linePath} fill="none" stroke="#1e40af" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {data.length <= 30 && data.map((d, i) => (
          <circle key={i} cx={px(i)} cy={py(d.pageviews)} r={3} fill="#1e40af" />
        ))}
        {xLabels.map(({ i, label }) => (
          <text key={i} x={px(i)} y={ch + 20} textAnchor="middle" fontSize={11} fill="#94a3b8">
            {label}
          </text>
        ))}
      </g>
    </svg>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "blue",
}: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  color?: "blue" | "green" | "purple" | "amber"
}) {
  const bg = { blue: "bg-[#dbeafe]", green: "bg-green-100", purple: "bg-purple-100", amber: "bg-amber-100" }[color]
  const text = { blue: "text-[#1e40af]", green: "text-green-600", purple: "text-purple-600", amber: "text-amber-600" }[color]

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl shrink-0", bg)}>
            <Icon className={cn("h-5 w-5", text)} />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-[#64748b] leading-tight">{label}</p>
            <p className="text-2xl font-bold text-[#0f172a] mt-0.5 tabular-nums">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {sub && <p className="text-xs text-[#94a3b8] mt-0.5">{sub}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const DAYS_OPTIONS = [7, 30, 90] as const
type DaysOption = (typeof DAYS_OPTIONS)[number]

export default function AnalyticsPage() {
  const [days, setDays] = useState<DaysOption>(30)
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback((d: DaysOption) => {
    setLoading(true)
    setError("")
    fetch(`/api/analytics/overview?days=${d}`)
      .then((r) => { if (!r.ok) throw new Error("Failed to load analytics."); return r.json() })
      .then((res) => setData(res))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load(days) }, [days, load])

  const avgPerDay = data && data.trend.length > 0
    ? Math.round(data.totals.pageviews / data.trend.length)
    : 0

  const topPath = data?.topPages?.[0]?.path ?? "—"

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-[#e2e8f0] bg-white shrink-0">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]">Analytics</h1>
          <p className="text-sm text-[#64748b] mt-0.5">Website traffic — tracked automatically</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-1">
          {DAYS_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => { setDays(d); load(d) }}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                days === d ? "bg-white text-[#0f172a] shadow-sm" : "text-[#64748b] hover:text-[#0f172a]"
              )}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1e40af] border-t-transparent" />
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <p className="text-[#0f172a] font-semibold">Could not load analytics</p>
            <p className="text-sm text-[#64748b]">{error}</p>
          </div>
        )}

        {!loading && !error && data && (
          <div className="space-y-6 max-w-6xl">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={MousePointerClick} label="Pageviews" value={data.totals.pageviews} sub={`Last ${days} days`} color="blue" />
              <StatCard icon={Users} label="Sessions" value={data.totals.sessions} sub={`Last ${days} days`} color="purple" />
              <StatCard icon={TrendingUp} label="Avg. per day" value={avgPerDay} sub="Pageviews / day" color="green" />
              <StatCard icon={Globe} label="Top page" value={topPath} sub={data.topPages[0] ? `${data.topPages[0].views.toLocaleString()} views` : ""} color="amber" />
            </div>

            {/* Trend chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-[#1e40af]" />
                  Pageviews over time
                  <Badge variant="outline" className="ml-auto text-xs font-normal">Last {days} days</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <AreaChart data={data.trend} />
              </CardContent>
            </Card>

            {/* Top pages */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[#1e40af]" />
                  Top pages
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {data.topPages.length === 0 ? (
                  <p className="text-sm text-[#94a3b8] py-8 text-center">No page data yet</p>
                ) : (
                  <div className="space-y-1">
                    {data.topPages.map(({ path, views }, i) => {
                      const maxViews = data.topPages[0].views
                      const pct = maxViews > 0 ? (views / maxViews) * 100 : 0
                      return (
                        <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-[#f8fafc] transition-colors">
                          <span className="w-5 text-xs text-[#94a3b8] tabular-nums text-right shrink-0">{i + 1}</span>
                          <div className="flex-1 min-w-0 space-y-1">
                            <p className="text-sm font-medium text-[#0f172a] truncate">{path}</p>
                            <div className="h-1.5 rounded-full bg-[#f1f5f9] overflow-hidden">
                              <div className="h-full rounded-full bg-[#1e40af] transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                          <span className="text-sm tabular-nums text-[#64748b] shrink-0">{views.toLocaleString()}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
