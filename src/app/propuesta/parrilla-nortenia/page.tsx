import { PropHero } from "@/src/features/propuesta/hero"
import { PropProblem } from "@/src/features/propuesta/problem"
import { PropCalculator } from "@/src/features/propuesta/calculator"
import { PropHiddenCosts } from "@/src/features/propuesta/hidden-costs"
import { PropSolution } from "@/src/features/propuesta/solution"
import { PropLifeWith } from "@/src/features/propuesta/life-with"
import { PropComparison } from "@/src/features/propuesta/comparison"
import { PropInvestment } from "@/src/features/propuesta/investment"
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
      <PropLifeWith />
      <PropComparison />
      <PropInvestment />
      <PropUrgency />
      <PropCTA />
    </>
  )
}
