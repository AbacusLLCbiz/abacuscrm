import { MarketingNav, HeroSection, ServicesSection, AboutSection, BookingCTA, ContactSection, MarketingFooter } from "@/features/marketing"

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
