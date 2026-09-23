"""Carrusel "Nuestro sitio se renovó" (5 diapositivas) con capturas reales del sitio.

    marketing/redes/capturas.sh          # toma capturas de brtechds.com -> salida/capturas/
    python3 marketing/redes/carrusel_sitio.py && marketing/redes/render.sh sitio
"""

import os
from PIL import Image
from sistema import AQUI, FONDO_VELO, FONDO_VELO_INVERTIDO, escribir, pagina, preparar

T = 5
D = preparar("sitio")
CAP = os.path.join(AQUI, "salida", "capturas")

# Capturas a 2x (1440 px de ancho CSS -> 2880 px). Recortes: solo la zona útil de cada sección.
Image.open(f"{CAP}/inicio.png").save(f"{D}/inicio.png")
Image.open(f"{CAP}/movil.png").save(f"{D}/movil.png")
Image.open(f"{CAP}/sec-servicios.png").crop((200, 790, 2680, 2230)).save(f"{D}/servicios-cards.png")
Image.open(f"{CAP}/sec-proyectos.png").crop((200, 620, 2680, 2060)).save(f"{D}/proyecto.png")

slides = {}
slides[1] = pagina(1, T, """
<div style="position:absolute;top:170px;left:0;right:0;text-align:center;z-index:4">
 <span class="pill"><span class="dot"></span>Sitio web nuevo</span>
 <h1 style="margin-top:30px;font-size:96px">Nuestro sitio<br><span class="grad">se renovó</span></h1>
 <p class="p" style="margin:22px auto 0;width:760px">Software a la medida para empresas. Conoce lo que construimos.</p>
</div>
<div style="position:absolute;top:640px;left:160px;width:760px;z-index:4">
 <div class="marco" style="border-radius:24px 24px 10px 10px"><div class="barra"><i></i><i></i><i></i><b>brtechds.com</b></div><img src="inicio.png"/></div>
 <div style="margin:0 -50px;height:22px;border-radius:0 0 26px 26px;background:linear-gradient(#2a2440,#141021);box-shadow:0 20px 50px rgba(0,0,0,.6)"></div>
</div>""", fondo=FONDO_VELO)

slides[2] = pagina(2, T, """
<div class="blob" style="width:600px;height:600px;right:-200px;top:520px"></div>
<div style="position:absolute;top:190px;left:72px;right:72px;z-index:4">
 <div class="eti">Servicios</div>
 <h2 style="margin-top:26px;font-size:84px">Lo que construimos<br><span class="grad">para tu negocio</span></h2>
 <p class="p" style="margin-top:24px;width:880px">No forzamos tu negocio a encajar en una herramienta: construimos la herramienta que encaja con él.</p>
</div>
<div style="position:absolute;top:640px;left:110px;right:110px;z-index:4"><div class="marco"><img src="servicios-cards.png"/></div></div>""")

slides[3] = pagina(3, T, """
<div class="blob" style="width:620px;height:620px;left:-220px;top:560px"></div>
<div style="position:absolute;top:190px;left:72px;right:72px;z-index:4">
 <span class="pill"><span class="dot v"></span>En producción · 2 sucursales conectadas</span>
 <h2 style="margin-top:30px;font-size:84px">Software real,<br><span class="grad">operando hoy</span></h2>
 <p class="p" style="margin-top:24px;width:900px">ParrillaNorteña Soft centraliza órdenes, caja y operación diaria en todas sus sucursales.</p>
</div>
<div style="position:absolute;top:670px;left:110px;right:110px;z-index:4"><div class="marco"><img src="proyecto.png"/></div></div>""")

slides[4] = pagina(4, T, """
<div class="blob" style="width:700px;height:700px;left:190px;top:520px"></div>
<div style="position:absolute;top:250px;left:72px;width:520px;z-index:4">
 <div class="eti">En cualquier pantalla</div>
 <h2 style="margin-top:26px;font-size:78px">Diseñado para <span class="grad">verse increíble</span> en tu celular</h2>
 <p class="p" style="margin-top:26px">Rápido, claro y listo para que tus clientes agenden desde donde estén.</p>
 <div style="margin-top:40px;display:flex;flex-direction:column;gap:18px;font-size:28px;color:rgba(255,255,255,.82)">
  <span><b style="color:#C9B5F5">✓</b>&nbsp; Carga inmediata</span><span><b style="color:#C9B5F5">✓</b>&nbsp; Agenda en un toque</span><span><b style="color:#C9B5F5">✓</b>&nbsp; Mismo diseño premium</span>
 </div>
</div>
<div style="position:absolute;top:220px;right:84px;width:390px;height:844px;border-radius:64px;padding:14px;background:#0b0914;border:2px solid rgba(255,255,255,.16);box-shadow:0 0 140px -30px rgba(120,54,226,.8),0 50px 90px -30px rgba(0,0,0,.9);z-index:4">
 <div style="position:relative;width:100%;height:100%;border-radius:52px;overflow:hidden"><img src="movil.png" style="width:100%;height:100%;object-fit:cover;object-position:top"/>
 <div style="position:absolute;top:12px;left:50%;transform:translateX(-50%);width:120px;height:34px;border-radius:20px;background:#000"></div></div>
</div>""")

slides[5] = pagina(5, T, """
<div style="position:absolute;top:300px;left:0;right:0;text-align:center;z-index:4">
 <div class="eti" style="justify-content:center">Hablemos <span style="width:48px;height:2px;background:#7836E2"></span></div>
 <h2 style="margin:34px auto 0;width:920px;font-size:96px">¿Listo para llevar tu negocio <span class="grad">al siguiente nivel?</span></h2>
 <p class="p" style="margin:32px auto 0;width:780px">Cuéntanos cómo funciona tu negocio por dentro y te proponemos la solución correcta.</p>
 <div class="boton" style="margin-top:56px">Agenda tu consulta gratuita →</div>
 <p style="margin-top:28px;font-size:26px;color:rgba(255,255,255,.6)">Cotización gratuita y sin compromiso</p>
</div>""", fondo=FONDO_VELO_INVERTIDO, desliza=False)

escribir(D, slides)
