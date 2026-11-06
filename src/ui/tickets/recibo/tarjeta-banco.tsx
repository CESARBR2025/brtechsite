"use client"

import type { DatosPagoDTO } from "@/src/modules/tickets/application/dtos"
import { SimboloBrTech } from "@/src/ui/marca/simbolo-brtech"
import { BotonCopiar } from "./boton-copiar"
import { SuperficieReactiva } from "./superficie-reactiva"

export function TarjetaBanco({ datos }: { datos: DatosPagoDTO }) {
  const clabe = `${datos.clabe.slice(0, 3)} ${datos.clabe.slice(3, 6)} ${datos.clabe.slice(6, 17)} ${datos.clabe.slice(17)}`
  return <SuperficieReactiva tipo="banco" className="exp-plastico mt-[18px] rounded-2xl p-5 text-white">
    <div className="flex items-center justify-between gap-3"><SimboloBrTech className="h-[30px] w-[30px] shrink-0" /><span className="break-words text-xs text-primary-light/60">{datos.banco}</span></div>
    <div className="my-3"><div className="text-xs text-primary-light/55">CLABE interbancaria</div><div className="mt-1 break-words font-mono text-[clamp(12px,4vw,17px)] tracking-[.08em] tabular-nums">{clabe}</div></div>
    <div className="flex items-end justify-between gap-2"><div className="min-w-0 break-words text-[13px] font-medium"><small className="block text-xs font-normal text-primary-light/55">Titular</small>{datos.titular}</div><BotonCopiar texto={datos.clabe} etiqueta="CLABE" aviso="CLABE copiada" oscuro /></div>
  </SuperficieReactiva>
}
