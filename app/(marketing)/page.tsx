import { MarketingFeatures } from "@/components/app/marketing-features"
import { MarketingFooter } from "@/components/app/marketing-footer"
import { MarketingHeaderDesktop } from "@/components/app/marketing-header-desktop"
import { MarketingHero } from "@/components/app/marketing-hero"
import { MarketingHowItWorks } from "@/components/app/marketing-how-it-works"
import { MarketingStats } from "@/components/app/marketing-stats"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="absolute inset-0 overflow-hidden bg-black/5">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={1}
          duration={3}
          className="text-primary/10"
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <MarketingHeaderDesktop />
        <MarketingHero />
        <MarketingStats />
        <MarketingFeatures />
        <MarketingHowItWorks />
        <MarketingFooter />
      </div>
    </div>
  )
}
