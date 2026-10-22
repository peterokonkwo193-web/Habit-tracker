import { LandingHero } from "@/components/landing/hero";
import { LandingFeatures } from "@/components/landing/features";
import { LandingDemo } from "@/components/landing/demo";
import { LandingTelegram } from "@/components/landing/telegram";
import { LandingAnalytics } from "@/components/landing/analytics";
import { LandingTestimonials } from "@/components/landing/testimonials";
import { LandingPricing } from "@/components/landing/pricing";
import { LandingFAQ } from "@/components/landing/faq";
import { LandingCTA } from "@/components/landing/cta";
import { LandingNav } from "@/components/landing/nav";
import { LandingFooter } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[rgb(248,250,252)] dark:bg-[rgb(10,10,15)]">
      <LandingNav />
      <LandingHero />
      <LandingFeatures />
      <LandingDemo />
      <LandingTelegram />
      <LandingAnalytics />
      <LandingTestimonials />
      <LandingPricing />
      <LandingFAQ />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
}
