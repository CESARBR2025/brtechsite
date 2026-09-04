import { Navbar } from "@/src/ui/marketing/navbar"
import { Footer } from "@/src/ui/marketing/footer"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
