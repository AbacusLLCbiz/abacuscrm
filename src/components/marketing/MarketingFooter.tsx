import Link from "next/link"
import { Building2 } from "lucide-react"

export function MarketingFooter() {
  return (
    <footer className="bg-[#0f172a] text-white py-16 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
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
            <p className="text-slate-400 text-sm leading-relaxed">
              Passion. Experience. Diligence.<br />
              Serving individuals and businesses for over 18 years.
            </p>
            <p className="text-[#60a5fa] text-sm font-semibold mt-3">Se habla Español</p>
          </div>

          {/* Services */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Services</p>
            <ul className="space-y-2">
              {["Tax Preparation", "Accounting", "Consulting", "Business Advice", "ITIN Services"].map((s) => (
                <li key={s}>
                  <a href="#services" className="text-slate-400 text-sm hover:text-white transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Contact</p>
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
                href="/admin"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Staff / Client Portal →
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Abacus Accounting, LLC. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">abacusllc.biz</p>
        </div>
      </div>
    </footer>
  )
}
