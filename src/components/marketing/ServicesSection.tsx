import { FileText, BarChart3, Lightbulb, Briefcase } from "lucide-react"
import { marketingContent, type Locale } from "@/lib/marketing-content"

const cardMeta = [
  {
    icon: FileText,
    color: "bg-[#eff6ff] text-[#1e40af]",
    accent: "border-[#bfdbfe] hover:border-[#1e40af]",
  },
  {
    icon: BarChart3,
    color: "bg-[#f0fdf4] text-[#16a34a]",
    accent: "border-[#bbf7d0] hover:border-[#16a34a]",
  },
  {
    icon: Lightbulb,
    color: "bg-[#fefce8] text-[#ca8a04]",
    accent: "border-[#fef08a] hover:border-[#ca8a04]",
  },
  {
    icon: Briefcase,
    color: "bg-[#fdf4ff] text-[#9333ea]",
    accent: "border-[#e9d5ff] hover:border-[#9333ea]",
  },
]

interface Props {
  locale?: Locale
}

export function ServicesSection({ locale = "en" }: Props) {
  const c = marketingContent[locale].services

  return (
    <section id="services" className="py-52 px-14 lg:px-32 bg-[#f8fafc]">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="max-w-2xl mb-28">
          <p className="text-sm font-bold text-[#1e40af] uppercase tracking-widest mb-4">{c.label}</p>
          <h2 className="text-5xl sm:text-6xl font-black leading-[0.95] tracking-tight text-[#0f172a]">
            {c.h2Part1}{" "}
            <span className="text-[#1e40af] italic">{c.h2Italic}</span>{" "}
            {c.h2Part2}
          </h2>
          <p className="mt-6 text-lg text-[#475569] font-medium">
            {c.subtext}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {c.cards.map((card, i) => {
            const meta = cardMeta[i]
            return (
              <div
                key={card.title}
                className={`rounded-3xl border-2 ${meta.accent} bg-white p-14 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl`}
              >
                <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${meta.color} mb-10`}>
                  <meta.icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black text-[#0f172a] mb-4">{card.title}</h3>
                <p className="text-[#475569] leading-relaxed mb-8">{card.description}</p>
                <ul className="space-y-3">
                  {card.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm font-medium text-[#374151]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#1e40af] shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
