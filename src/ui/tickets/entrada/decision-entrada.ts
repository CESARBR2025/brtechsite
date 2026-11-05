export function debeReproducirEntrada({ reducido, visto }: { reducido: boolean; visto: boolean }): boolean {
  return !reducido && !visto
}

export function claveEntrada(slug: string): string {
  return `brtech-entrada-${slug}`
}
