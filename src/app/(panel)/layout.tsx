import type { Metadata, Viewport } from "next"
import { RegistrarServiceWorker } from "@/src/ui/panel/pwa"

// El manifiesto vive solo aquí: el panel es instalable como app, el sitio
// público y los diagnósticos de clientes no.
export const metadata: Metadata = {
  title: "Panel · BR TECH",
  robots: { index: false, follow: false },
  manifest: "/panel.webmanifest",
  appleWebApp: {
    capable: true,
    title: "BR TECH",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/pwa/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#151127",
  viewportFit: "cover",
}

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-bg-section">
      <RegistrarServiceWorker />
      {children}
    </div>
  )
}
