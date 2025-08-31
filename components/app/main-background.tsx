import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"

export function MainBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-30">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.5}
        duration={3}
        className="text-blue-600/20 dark:text-blue-400/20"
      />
    </div>
  )
}
