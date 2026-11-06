"use client"

import { useId } from "react"
import { SuperficieReactiva } from "./superficie-reactiva"

export function MedallaGarantia({ dias }: { dias: number }) {
  const id = useId()
  return <SuperficieReactiva tipo="medalla" className="exp-medalla" >
    <svg viewBox="0 0 170 170" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-medalla`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="var(--color-primary-light)" /><stop offset=".35" stopColor="var(--color-primary)" /><stop offset=".7" stopColor="var(--color-primary)" /><stop offset="1" stopColor="var(--color-primary-hover)" /></linearGradient>
        <linearGradient id={`${id}-centro`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--color-primary-hover)" /><stop offset="1" stopColor="var(--color-bg-dark)" /></linearGradient>
        <path id={`${id}-anillo`} d="M85 85m-55 0a55 55 0 1 1 110 0a55 55 0 1 1-110 0" />
      </defs>
      <path d="M85.00 5.00L92.16 12.35L100.61 6.54L106.19 15.14L115.61 11.09L119.41 20.62L129.45 18.48L131.31 28.57L141.57 28.43L141.43 38.69L151.52 40.55L149.38 50.59L158.91 54.39L154.86 63.81L163.46 69.39L157.65 77.84L165.00 85.00L157.65 92.16L163.46 100.61L154.86 106.19L158.91 115.61L149.38 119.41L151.52 129.45L141.43 131.31L141.57 141.57L131.31 141.43L129.45 151.52L119.41 149.38L115.61 158.91L106.19 154.86L100.61 163.46L92.16 157.65L85.00 165.00L77.84 157.65L69.39 163.46L63.81 154.86L54.39 158.91L50.59 149.38L40.55 151.52L38.69 141.43L28.43 141.57L28.57 131.31L18.48 129.45L20.62 119.41L11.09 115.61L15.14 106.19L6.54 100.61L12.35 92.16L5.00 85.00L12.35 77.84L6.54 69.39L15.14 63.81L11.09 54.39L20.62 50.59L18.48 40.55L28.57 38.69L28.43 28.43L38.69 28.57L40.55 18.48L50.59 20.62L54.39 11.09L63.81 15.14L69.39 6.54L77.84 12.35Z" fill={`url(#${id}-medalla)`}/>
      <circle cx="85" cy="85" r="68" fill="none" stroke="var(--color-primary-light)" strokeOpacity=".55" strokeWidth="1" />
      <circle cx="85" cy="85" r="64" fill={`url(#${id}-centro)`} />
      <circle cx="85" cy="85" r="46" fill="none" stroke="var(--color-primary-light)" strokeOpacity=".35" strokeDasharray="1.5 3" />
      <g className="exp-medalla-giro"><text><textPath href={`#${id}-anillo`}>GARANTÍA BR TECH · SERVICIO RESPALDADO · </textPath></text></g>
    </svg>
    <div aria-hidden="true" className="exp-foil" />
    <div aria-hidden="true" className="exp-medalla-centro"><b className="font-hero">{dias}</b><span>días</span></div>
  </SuperficieReactiva>
}
