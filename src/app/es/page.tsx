import { MarketingNav } from "@/components/marketing/MarketingNav"
import { HeroSection } from "@/components/marketing/HeroSection"
import { ServicesSection } from "@/components/marketing/ServicesSection"
import { AboutSection } from "@/components/marketing/AboutSection"
import { BookingCTA } from "@/components/marketing/BookingCTA"
import { ContactSection } from "@/components/marketing/ContactSection"
import { MarketingFooter } from "@/components/marketing/MarketingFooter"

export default function SpanishHomePage() {
  return (
    <main className="bg-white min-h-screen text-[#0f172a] overflow-x-hidden">
      <MarketingNav locale="es" />
      <HeroSection locale="es" />
      <ServicesSection locale="es" />
      <AboutSection locale="es" />
      <BookingCTA locale="es" />
      <ContactSection locale="es" />
      <MarketingFooter locale="es" />
    </main>
  )
}
