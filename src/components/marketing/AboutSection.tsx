import { Heart, ShieldCheck, Zap } from "lucide-react"

const values = [
  {
    icon: Heart,
    color: "text-rose-500 bg-rose-50",
    title: "Passion",
    description: "We genuinely care about your financial wellbeing. This isn't just work to us — it's how we help families and businesses thrive.",
  },
  {
    icon: ShieldCheck,
    color: "text-[#1e40af] bg-[#eff6ff]",
    title: "Experience",
    description: "Over 18 years helping individuals and businesses navigate complex tax laws, accounting challenges, and financial decisions.",
  },
  {
    icon: Zap,
    color: "text-amber-500 bg-amber-50",
    title: "Diligence",
    description: "We stay up to date on every tax law change so you don't have to. Accurate, thorough, and always on your side.",
  },
]

export function AboutSection() {
  return (
    <section id="about" className="py-52 px-14 lg:px-32 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Left — text */}
          <div>
            <p className="text-sm font-bold text-[#1e40af] uppercase tracking-widest mb-4">Who we are</p>
            <h2 className="text-5xl sm:text-6xl font-black leading-[0.95] tracking-tight text-[#0f172a] mb-8">
              We take the{" "}
              <span className="text-[#1e40af] italic">stress</span>{" "}
              out of taxes.
            </h2>
            <p className="text-lg text-[#475569] leading-relaxed mb-6 font-medium">
              At Abacus Accounting, LLC, we believe that managing your finances shouldn&apos;t be overwhelming.
              We handle the complexity so you can focus on what matters — growing your business and living your life.
            </p>
            <p className="text-lg text-[#475569] leading-relaxed mb-10">
              We offer flexible scheduling, transparent communication, and personalized service that evolves with your needs.
              And yes — <strong className="text-[#0f172a]">hablamos español.</strong>
            </p>

            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border-2 border-[#bfdbfe] bg-[#eff6ff] px-6 py-3 text-sm font-bold text-[#1e40af]">
                Individual Tax
              </span>
              <span className="rounded-full border-2 border-[#bbf7d0] bg-[#f0fdf4] px-6 py-3 text-sm font-bold text-[#16a34a]">
                Business Tax
              </span>
              <span className="rounded-full border-2 border-[#fde68a] bg-[#fefce8] px-6 py-3 text-sm font-bold text-[#ca8a04]">
                Consulting
              </span>
              <span className="rounded-full border-2 border-[#e9d5ff] bg-[#fdf4ff] px-6 py-3 text-sm font-bold text-[#9333ea]">
                Se habla Español
              </span>
            </div>
          </div>

          {/* Right — value cards */}
          <div className="space-y-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="flex items-start gap-7 rounded-3xl border border-[#e2e8f0] p-12 hover:border-[#1e40af] hover:shadow-lg transition-all duration-200"
              >
                <div className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${v.color}`}>
                  <v.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#0f172a] mb-1">{v.title}</h3>
                  <p className="text-[#475569] leading-relaxed">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
