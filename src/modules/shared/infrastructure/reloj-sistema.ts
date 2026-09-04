import type { Reloj } from "../domain/reloj"

export class RelojSistema implements Reloj {
  ahora(): Date {
    return new Date()
  }
}

export const relojSistema = new RelojSistema()
