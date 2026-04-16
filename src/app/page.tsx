import { MarketingNav } from "@/components/marketing/MarketingNav"
import { HeroSection } from "@/components/marketing/HeroSection"
import { ServicesSection } from "@/components/marketing/ServicesSection"
import { AboutSection } from "@/components/marketing/AboutSection"
import { BookingCTA } from "@/components/marketing/BookingCTA"
import { ContactSection } from "@/components/marketing/ContactSection"
import { MarketingFooter } from "@/components/marketing/MarketingFooter"

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
