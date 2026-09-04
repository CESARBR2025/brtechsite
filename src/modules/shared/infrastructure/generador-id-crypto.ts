import { randomUUID } from "node:crypto"
import type { GeneradorId } from "../domain/id"

export class GeneradorIdCrypto implements GeneradorId {
  nuevo(): string {
    return randomUUID()
  }
}

export const generadorIdCrypto = new GeneradorIdCrypto()
