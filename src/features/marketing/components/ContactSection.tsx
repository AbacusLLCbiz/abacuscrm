import { Phone, Mail, Globe } from "lucide-react"
import { marketingContent, type Locale } from "../content"

const contactMeta = [
  {
    icon: Phone,
    color: "bg-[#eff6ff] text-[#1e40af]",
    border: "border-[#bfdbfe] hover:border-[#1e40af]",
    value: "(515) 200-7831",
    href: "tel:+15152007831",
  },
  {
    icon: Mail,
    color: "bg-[#f0fdf4] text-[#16a34a]",
    border: "border-[#bbf7d0] hover:border-[#16a34a]",
    value: "info@abacusllc.biz",
    href: "mailto:info@abacusllc.biz",
  },
  {
    icon: Globe,
    color: "bg-[#fdf4ff] text-[#9333ea]",
    border: "border-[#e9d5ff] hover:border-[#9333ea]",
    value: "English & Español",
    href: "#",
  },
]

interface Props {
  locale?: Locale
}

export function ContactSection({ locale = "en" }: Props) {
  const c = marketingContent[locale].contact

  return (
    <section id="contact" className="py-52 px-14 lg:px-32 bg-[#f8fafc]">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl mb-28">
          <p className="text-sm font-bold text-[#1e40af] uppercase tracking-widest mb-4">{c.label}</p>
          <h2 className="text-5xl sm:text-6xl font-black leading-[0.95] tracking-tight text-[#0f172a]">
            {c.h2Part1}{" "}
            {c.h2Italic && <span className="text-[#1e40af] italic">{c.h2Italic}</span>}
          </h2>
          <p className="mt-6 text-lg text-[#475569] font-medium">
            {c.subtext}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {c.cards.map((card, i) => {
            const meta = contactMeta[i]
            return (
              <a
                key={card.label}
                href={meta.href}
                className={`group rounded-3xl border-2 ${meta.border} bg-white p-14 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl block`}
              >
                <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${meta.color} mb-10`}>
                  <meta.icon className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold text-[#64748b] uppercase tracking-wider mb-2">{card.label}</p>
                <p className="text-xl font-black text-[#0f172a] mb-1">{meta.value}</p>
                <p className="text-sm text-[#64748b]">{card.sub}</p>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
