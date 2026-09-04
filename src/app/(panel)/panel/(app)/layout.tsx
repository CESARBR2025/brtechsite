import { ShellPanel } from "@/src/ui/panel/shell-panel"

export default function LayoutApp({
  children,
}: {
  children: React.ReactNode
}) {
  return <ShellPanel>{children}</ShellPanel>
}
