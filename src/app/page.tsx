import { MarketingNav, HeroSection, ServicesSection, AboutSection, BookingCTA, ContactSection, MarketingFooter } from "@/features/marketing"

export default function HomePage() {
  return (
    <main className="bg-white min-h-screen text-[#0f172a] overflow-x-hidden">
      <MarketingNav />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <BookingCTA />
      <ContactSection />
      <MarketingFooter />
    </main>
  )
}
