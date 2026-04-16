import { FileText, BarChart3, Lightbulb, Briefcase } from "lucide-react"

const services = [
  {
    icon: FileText,
    color: "bg-[#eff6ff] text-[#1e40af]",
    accent: "border-[#bfdbfe] hover:border-[#1e40af]",
    title: "Tax Preparation",
    description:
      "Individual and business tax return preparation. We stay current on tax laws to ensure accuracy and maximize your refund — year-round support included.",
    highlights: ["Individual & business returns", "Tax agency notices", "Offer in compromise", "Installment plans"],
  },
  {
    icon: BarChart3,
    color: "bg-[#f0fdf4] text-[#16a34a]",
    accent: "border-[#bbf7d0] hover:border-[#16a34a]",
    title: "Accounting",
    description:
      "Monthly, quarterly, and yearly accounting services with full financial statement preparation. Get a clear snapshot of your business performance.",
    highlights: ["Monthly bookkeeping", "Financial statements", "Income & expense tracking", "Business snapshots"],
  },
  {
    icon: Lightbulb,
    color: "bg-[#fefce8] text-[#ca8a04]",
    accent: "border-[#fef08a] hover:border-[#ca8a04]",
    title: "Consulting",
    description:
      "Tax planning to reduce your burden, college and retirement savings strategies, ITIN services, and proactive advice tailored to your situation.",
    highlights: ["Tax planning", "Retirement savings", "College savings", "ITIN services"],
  },
  {
    icon: Briefcase,
    color: "bg-[#fdf4ff] text-[#9333ea]",
    accent: "border-[#e9d5ff] hover:border-[#9333ea]",
    title: "Business Advice",
    description:
      "Strategic guidance to help your business grow. We don't just prepare your taxes — we act as your trusted advisor for business decisions.",
    highlights: ["Growth strategy", "Business structure", "Financial planning", "Ongoing support"],
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-24 px-6 bg-[#f8fafc]">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-bold text-[#1e40af] uppercase tracking-widest mb-4">What we do</p>
          <h2 className="text-5xl sm:text-6xl font-black leading-[0.95] tracking-tight text-[#0f172a]">
            Everything your{" "}
            <span className="text-[#1e40af] italic">finances</span>{" "}
            need.
          </h2>
          <p className="mt-6 text-lg text-[#475569] font-medium">
            Comprehensive accounting solutions delivered with transparency, flexibility, and 18+ years of expertise.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className={`rounded-2xl border-2 ${s.accent} bg-white p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${s.color} mb-6`}>
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-black text-[#0f172a] mb-3">{s.title}</h3>
              <p className="text-[#475569] leading-relaxed mb-6">{s.description}</p>
              <ul className="space-y-2">
                {s.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm font-medium text-[#374151]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1e40af] shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
