export function HeroSection() {
  return (
    <section className="relative min-h-[820px] flex items-center overflow-hidden bg-white pt-36 pb-32">
      {/* Background photo — covers right portion */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/hero-bg.png')",
          backgroundPosition: "70% center",
        }}
      />

      {/* White gradient overlay — left side so text pops */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, white 42%, rgba(255,255,255,0.95) 52%, rgba(255,255,255,0.6) 68%, rgba(255,255,255,0) 85%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl w-full px-14 lg:px-32">
        <div className="max-w-2xl">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-4 py-1.5 mb-12">
            <span className="h-2 w-2 rounded-full bg-[#1e40af] animate-pulse" />
            <span className="text-sm font-semibold text-[#1e40af]">Over 18 years of experience</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight text-[#0f172a]">
            It&apos;s time to{" "}
            <br className="hidden sm:block" />
            get your taxes{" "}
            <span className="italic" style={{ color: "#1e40af" }}>
              done right.
            </span>
          </h1>

          <p className="mt-10 text-lg text-[#475569] max-w-lg leading-relaxed font-medium">
            Abacus Accounting, LLC — personalized tax preparation, accounting,
            and business consulting. Hassle-free. Transparent. In English and Spanish.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href="#book"
              className="rounded-full bg-[#1e40af] px-10 py-5 text-base font-bold text-white hover:bg-[#1d4ed8] transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5"
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

          {/* Stats */}
          <div className="mt-20 flex flex-wrap items-start gap-14 pt-10 border-t border-[#e2e8f0]">
            {[
              { value: "18+", label: "Years of experience" },
              { value: "100%", label: "Personalized service" },
              { value: "2", label: "Languages spoken" },
            ].map((s, i) => (
              <div key={s.label} className="flex items-start gap-4">
                {i > 0 && <div className="w-px h-12 bg-[#e2e8f0] self-center" />}
                <div>
                  <p className="text-4xl font-black text-[#1e40af] leading-none">{s.value}</p>
                  <p className="text-sm text-[#64748b] font-medium mt-2">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
