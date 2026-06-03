import { PropHero } from "@/src/features/propuesta/hero"
import { PropProblem } from "@/src/features/propuesta/problem"
import { PropCalculator } from "@/src/features/propuesta/calculator"
import { PropHiddenCosts } from "@/src/features/propuesta/hidden-costs"
import { PropSolution } from "@/src/features/propuesta/solution"
import { PropTimeline } from "@/src/features/propuesta/timeline"
import { PropLifeWith } from "@/src/features/propuesta/life-with"
import { PropComparison } from "@/src/features/propuesta/comparison"
import { PropInvestment } from "@/src/features/propuesta/investment"
import { PropHosting } from "@/src/features/propuesta/hosting"
import { PropUrgency } from "@/src/features/propuesta/urgency"
import { PropCTA } from "@/src/features/propuesta/cta"

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
