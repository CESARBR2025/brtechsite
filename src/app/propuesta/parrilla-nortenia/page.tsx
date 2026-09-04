import { PropHero } from "@/src/ui/marketing/propuesta/hero"
import { PropProblem } from "@/src/ui/marketing/propuesta/problem"
import { PropCalculator } from "@/src/ui/marketing/propuesta/calculator"
import { PropHiddenCosts } from "@/src/ui/marketing/propuesta/hidden-costs"
import { PropSolution } from "@/src/ui/marketing/propuesta/solution"
import { PropTimeline } from "@/src/ui/marketing/propuesta/timeline"
import { PropLifeWith } from "@/src/ui/marketing/propuesta/life-with"
import { PropComparison } from "@/src/ui/marketing/propuesta/comparison"
import { PropInvestment } from "@/src/ui/marketing/propuesta/investment"
import { PropHosting } from "@/src/ui/marketing/propuesta/hosting"
import { PropUrgency } from "@/src/ui/marketing/propuesta/urgency"
import { PropCTA } from "@/src/ui/marketing/propuesta/cta"

export default function PropuestaParrillaNortenia() {
  return (
    <>
      <PropHero />
      <PropProblem />
      <PropCalculator />
      <PropHiddenCosts />
      <PropSolution />
      <PropTimeline />

      <PropComparison />
      <PropLifeWith />
      <PropInvestment />
      <PropHosting />
      <PropUrgency />
      <PropCTA />
    </>
  )
}
