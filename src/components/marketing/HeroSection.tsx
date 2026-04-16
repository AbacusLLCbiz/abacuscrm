import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-white">
      {/* Background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-40 h-[600px] w-[600px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-60 -left-40 h-[400px] w-[400px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #1e40af 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-4 py-1.5 mb-8">
            <span className="h-2 w-2 rounded-full bg-[#1e40af] animate-pulse" />
            <span className="text-sm font-semibold text-[#1e40af]">Over 18 years of experience</span>
          </div>

          {/* Headline — Toggl-style giant bold */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight text-[#0f172a]">
            It&apos;s time to{" "}
            <br className="hidden sm:block" />
            get your taxes{" "}
            <span
              className="italic"
              style={{
                color: "#1e40af",
                WebkitTextStroke: "2px #1e40af",
              }}
            >
              done right.
            </span>
          </h1>

          <p className="mt-8 text-xl text-[#475569] max-w-xl leading-relaxed font-medium">
            Abacus Accounting, LLC — personalized tax preparation, accounting,
            and business consulting. Hassle-free. Transparent. In English and Spanish.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#book"
              className="rounded-full bg-[#1e40af] px-8 py-4 text-base font-bold text-white hover:bg-[#1d4ed8] transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5"
            >
              Book a free meeting
            </a>
            <a
              href="#services"
              className="flex items-center gap-2 text-base font-semibold text-[#475569] hover:text-[#1e40af] transition-colors"
            >
              See our services <span aria-hidden>→</span>
            </a>
          </div>

          {/* Trust row */}
          <div className="mt-16 flex flex-wrap items-center gap-8">
            {[
              { value: "18+", label: "Years of experience" },
              { value: "100%", label: "Personalized service" },
              { value: "2", label: "Languages spoken" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-black text-[#1e40af]">{s.value}</p>
                <p className="text-sm text-[#64748b] font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating accent card */}
      <div className="absolute right-8 top-40 hidden xl:block">
        <div className="rounded-2xl bg-[#1e40af] p-6 shadow-2xl shadow-blue-200 w-64 rotate-3 hover:rotate-0 transition-transform duration-500">
          <p className="text-white font-black text-2xl leading-tight">Passion. Experience. Diligence.</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <div>
              <p className="text-blue-100 text-xs font-semibold">Abacus Accounting</p>
              <p className="text-blue-300 text-[10px]">abacusllc.biz</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
