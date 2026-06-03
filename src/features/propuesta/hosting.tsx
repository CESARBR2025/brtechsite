import { CheckCircle, XCircle, Cloud, Wrench } from "lucide-react"

export function PropHosting() {
  const incluye = [
    "Hosting seguro en la nube para mantener el sistema disponible en internet.",
    "Respaldo automático de información (backups) para proteger los datos del negocio.",
    "Monitoreo básico del sistema para detectar fallas de funcionamiento.",
    "Actualizaciones de seguridad necesarias para mantener la plataforma protegida.",
    "Soporte técnico correctivo ante errores o incidencias del sistema.",
    "Restauración de respaldos en caso de pérdida accidental de información.",
    "Hasta 1 hora mensual de ajustes menores o correcciones pequeñas.",
  ]

  const noIncluye = [
    "Desarrollo de nuevas funcionalidades.",
    "Cambios importantes en procesos, módulos o pantallas existentes.",
    "Integraciones con sistemas externos o servicios de terceros.",
    "Capacitación adicional para nuevos empleados.",
    "Migraciones de información masivas.",
    "Personalización avanzada o rediseño de la interfaz.",
    "Soporte por problemas de hardware, internet o equipos del cliente.",
    "Trabajos que requieran más de 1 hora de desarrollo mensual.",
  ]

  return (
    <section id="hosting" className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-white py-20 sm:py-28">
      <div className="absolute -right-32 top-1/3 h-72 w-72 rounded-full bg-sky-100 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-xs font-semibold text-sky-700">
            <Cloud className="h-3.5 w-3.5" />
            Servicio Mensual
          </div>
          <h2 className="mt-4 text-[26px] font-bold text-[#1A1A2E] sm:text-4xl">
            Hosting y Soporte
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            <span className="font-bold">$400 MXN</span> mensuales — todo incluido
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Incluye */}
          <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <CheckCircle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-emerald-800">Incluye</h3>
            </div>
            <ul className="space-y-3">
              {incluye.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* No incluye */}
          <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
                <XCircle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-red-800">No incluye</h3>
            </div>
            <ul className="space-y-3">
              {noIncluye.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Servicios Adicionales */}
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center shadow-sm">
            <div className="mb-3 flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-200 text-amber-700">
                <Wrench className="h-5 w-5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-amber-900">
              Servicios Adicionales
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-amber-800">
              Cualquier mejora, nueva funcionalidad o desarrollo solicitado
              posteriormente será cotizado por separado antes de su implementación.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
