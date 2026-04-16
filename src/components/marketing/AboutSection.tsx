import { Heart, ShieldCheck, Zap } from "lucide-react"
import { marketingContent, type Locale } from "@/lib/marketing-content"

const valueMeta = [
  { icon: Heart, color: "text-rose-500 bg-rose-50" },
  { icon: ShieldCheck, color: "text-[#1e40af] bg-[#eff6ff]" },
  { icon: Zap, color: "text-amber-500 bg-amber-50" },
]

interface Props {
  locale?: Locale
}

export function AboutSection({ locale = "en" }: Props) {
  const c = marketingContent[locale].about

  return (
    <section id="about" className="py-52 px-14 lg:px-32 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Left — text */}
          <div>
            <p className="text-sm font-bold text-[#1e40af] uppercase tracking-widest mb-4">{c.label}</p>
            <h2 className="text-5xl sm:text-6xl font-black leading-[0.95] tracking-tight text-[#0f172a] mb-8">
              {c.h2Part1}{" "}
              <span className="text-[#1e40af] italic">{c.h2Italic}</span>{" "}
              {c.h2Part2}
            </h2>
            <p className="text-lg text-[#475569] leading-relaxed mb-6 font-medium">
              {c.p1}
            </p>
            <p className="text-lg text-[#475569] leading-relaxed mb-10">
              {c.p2} <strong className="text-[#0f172a]">{c.p2Bold}</strong>
            </p>

            <div className="flex flex-wrap gap-3">
              {c.pills.map((pill) => (
                <span
                  key={pill.label}
                  className={`rounded-full border-2 ${pill.color} px-6 py-3 text-sm font-bold`}
                >
                  {pill.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right — value cards */}
          <div className="space-y-6">
            {c.values.map((v, i) => {
              const meta = valueMeta[i]
              return (
                <div
                  key={v.title}
                  className="flex items-start gap-7 rounded-3xl border border-[#e2e8f0] p-12 hover:border-[#1e40af] hover:shadow-lg transition-all duration-200"
                >
                  <div className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${meta.color}`}>
                    <meta.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#0f172a] mb-1">{v.title}</h3>
                    <p className="text-[#475569] leading-relaxed">{v.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
