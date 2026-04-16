import { Calendar, Clock, Video, MapPin } from "lucide-react"
import { marketingContent, type Locale } from "@/lib/marketing-content"

const meetingIcons = [MapPin, Video, Video, Clock]

interface Props {
  locale?: Locale
}

export function BookingCTA({ locale = "en" }: Props) {
  const c = marketingContent[locale].booking

  return (
    <section id="book" className="py-52 px-14 lg:px-32 bg-[#1e40af] relative overflow-hidden">
      {/* Background pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #60a5fa 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #93c5fd 0%, transparent 40%)`,
        }}
      />

      <div className="mx-auto max-w-7xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left */}
          <div>
            <p className="text-blue-200 text-sm font-bold uppercase tracking-widest mb-4">{c.label}</p>
            <h2 className="text-5xl sm:text-6xl font-black text-white leading-[0.95] tracking-tight mb-6">
              {c.h2Part1}{" "}
              <span className="text-[#60a5fa] italic">{c.h2Italic}</span>
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed mb-8 font-medium">
              {c.subtext}
            </p>
            <a
              href="/book/consultation"
              className="inline-flex items-center gap-2 rounded-full bg-white px-10 py-5 text-base font-bold text-[#1e40af] hover:bg-[#eff6ff] transition-all shadow-lg hover:-translate-y-0.5"
            >
              <Calendar className="h-5 w-5" />
              {c.cta}
            </a>
          </div>

          {/* Right — meeting type cards */}
          <div className="grid grid-cols-2 gap-6">
            {c.meetingTypes.map((m, i) => {
              const Icon = meetingIcons[i]
              return (
                <div
                  key={m.label}
                  className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-9 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <Icon className="h-8 w-8 text-[#60a5fa] mb-5" />
                  <p className="text-white font-bold text-base">{m.label}</p>
                  <p className="text-blue-200 text-sm">{m.sub}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
