import { type NextRequest, NextResponse } from "next/server"
import {
  NOMBRE_COOKIE_SESION,
  tokenSesionValido,
} from "@/src/modules/panel/infrastructure/sesion"

export const config = {
  matcher: ["/panel/:path*"],
}

export async function proxy(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl

  if (pathname === "/panel/login") {
    return NextResponse.next()
  }

  const secreto = process.env.PANEL_SESSION_SECRET
  const token = req.cookies.get(NOMBRE_COOKIE_SESION)?.value

  if (!secreto || !(await tokenSesionValido(token, secreto))) {
    const url = req.nextUrl.clone()
    url.pathname = "/panel/login"
    url.searchParams.set("redirigir", pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
