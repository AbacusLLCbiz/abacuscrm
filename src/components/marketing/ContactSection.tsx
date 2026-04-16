import { Phone, Mail, Globe } from "lucide-react"

export function ContactSection() {
  return (
    <section id="contact" className="py-40 px-8 lg:px-20 bg-[#f8fafc]">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl mb-24">
          <p className="text-sm font-bold text-[#1e40af] uppercase tracking-widest mb-4">Get in touch</p>
          <h2 className="text-5xl sm:text-6xl font-black leading-[0.95] tracking-tight text-[#0f172a]">
            Let&apos;s{" "}
            <span className="text-[#1e40af] italic">talk.</span>
          </h2>
          <p className="mt-6 text-lg text-[#475569] font-medium">
            Have questions? Reach out directly. We respond fast.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: Phone,
              color: "bg-[#eff6ff] text-[#1e40af]",
              border: "border-[#bfdbfe] hover:border-[#1e40af]",
              label: "Phone",
              value: "(515) 200-7831",
              href: "tel:+15152007831",
              sub: "Call or text us",
            },
            {
              icon: Mail,
              color: "bg-[#f0fdf4] text-[#16a34a]",
              border: "border-[#bbf7d0] hover:border-[#16a34a]",
              label: "Email",
              value: "info@abacusllc.biz",
              href: "mailto:info@abacusllc.biz",
              sub: "We reply within 24 hours",
            },
            {
              icon: Globe,
              color: "bg-[#fdf4ff] text-[#9333ea]",
              border: "border-[#e9d5ff] hover:border-[#9333ea]",
              label: "Languages",
              value: "English & Español",
              href: "#",
              sub: "Hablamos español",
            },
          ].map((c) => (
            <a
              key={c.label}
              href={c.href}
              className={`group rounded-2xl border-2 ${c.border} bg-white p-12 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl block`}
            >
              <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${c.color} mb-10`}>
                <c.icon className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-[#64748b] uppercase tracking-wider mb-2">{c.label}</p>
              <p className="text-xl font-black text-[#0f172a] mb-1">{c.value}</p>
              <p className="text-sm text-[#64748b]">{c.sub}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
