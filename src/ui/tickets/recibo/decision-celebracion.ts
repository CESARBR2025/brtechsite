export function debeCelebrar({ reducido, visto }: { reducido: boolean; visto: boolean }): boolean {
  return !reducido && !visto
}
