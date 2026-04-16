import Link from "next/link"
import { Building2 } from "lucide-react"
import { marketingContent, type Locale } from "../content"

interface Props {
  locale?: Locale
}

export function MarketingFooter({ locale = "en" }: Props) {
  const c = marketingContent[locale].footer

  return (
    <footer className="bg-[#0f172a] text-white py-28 px-14 lg:px-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 mb-20">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1e40af]">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div className="leading-none">
                <span className="text-base font-black text-white tracking-tight">abacus</span>
                <span className="text-base font-black text-[#60a5fa] tracking-tight"> accounting</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">
              {c.tagline}
            </p>
            <p className="text-[#60a5fa] text-sm font-semibold mt-3">{c.seHablaEspanol}</p>
          </div>

          {/* Services */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">{c.servicesHeader}</p>
            <ul className="space-y-2">
              {c.services.map((s) => (
                <li key={s}>
                  <a href="#services" className="text-slate-400 text-sm hover:text-white transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">{c.contactHeader}</p>
            <ul className="space-y-2">
              <li>
                <a href="tel:+15152007831" className="text-slate-400 text-sm hover:text-white transition-colors">(515) 200-7831</a>
              </li>
              <li>
                <a href="mailto:info@abacusllc.biz" className="text-slate-400 text-sm hover:text-white transition-colors">info@abacusllc.biz</a>
              </li>
            </ul>
            <div className="mt-6">
              <Link
                href={c.portalLink.href}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                {c.portalLink.label}
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            {c.copyright(new Date().getFullYear())}
          </p>
          <p className="text-slate-600 text-xs">abacusllc.biz</p>
        </div>
      </div>
    </footer>
  )
}
