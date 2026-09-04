import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Panel · BR TECH",
  robots: { index: false, follow: false },
}

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-bg-section">{children}</div>
}
