import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: { value: number; label: string }
  color?: "blue" | "green" | "amber" | "red"
}

const colorMap = {
  blue: { bg: "bg-[#dbeafe]", icon: "text-[#1e40af]", value: "text-[#1e3a8a]" },
  green: { bg: "bg-green-50", icon: "text-green-600", value: "text-green-800" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600", value: "text-amber-800" },
  red: { bg: "bg-red-50", icon: "text-red-500", value: "text-red-800" },
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend, color = "blue" }: StatsCardProps) {
  const colors = colorMap[color]
  return (
    <div className="flex items-center gap-5 rounded-xl border border-[#e2e8f0] bg-white p-7 shadow-sm">
      <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", colors.bg)}>
        <Icon className={cn("h-5 w-5", colors.icon)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#64748b] font-medium">{title}</p>
        <p className={cn("text-2xl font-bold mt-0.5", colors.value)}>{value}</p>
        {subtitle && <p className="text-xs text-[#94a3b8] mt-0.5">{subtitle}</p>}
        {trend && (
          <p className={cn("text-xs mt-1", trend.value >= 0 ? "text-green-600" : "text-red-500")}>
            {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
          </p>
        )}
      </div>
    </div>
  )
}
