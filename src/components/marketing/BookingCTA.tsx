import { Calendar, Clock, Video, MapPin } from "lucide-react"

export function BookingCTA() {
  return (
    <section id="book" className="py-32 px-8 lg:px-16 bg-[#1e40af] relative overflow-hidden">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <p className="text-blue-200 text-sm font-bold uppercase tracking-widest mb-4">Get started</p>
            <h2 className="text-5xl sm:text-6xl font-black text-white leading-[0.95] tracking-tight mb-6">
              Ready to get on{" "}
              <span className="text-[#60a5fa] italic">the schedule?</span>
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed mb-8 font-medium">
              Book a free consultation with our team. We offer in-person, virtual, and phone meetings —
              whatever works best for you.
            </p>
            <a
              href="/book/consultation"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-[#1e40af] hover:bg-[#eff6ff] transition-all shadow-lg hover:-translate-y-0.5"
            >
              <Calendar className="h-5 w-5" />
              Schedule now — it&apos;s free
            </a>
          </div>

          {/* Right — meeting type cards */}
          <div className="grid grid-cols-2 gap-5">
            {[
              { icon: MapPin, label: "In Person", sub: "Our office" },
              { icon: Video, label: "Zoom", sub: "Video call" },
              { icon: Video, label: "Google Meet", sub: "Video call" },
              { icon: Clock, label: "Phone", sub: "Quick call" },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-7 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <m.icon className="h-7 w-7 text-[#60a5fa] mb-4" />
                <p className="text-white font-bold text-base">{m.label}</p>
                <p className="text-blue-200 text-sm">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
