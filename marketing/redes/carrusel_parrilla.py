"""Carrusel de caso de éxito: Parrilla Norteña Soft (5 diapositivas).

    python3 marketing/redes/carrusel_parrilla.py && marketing/redes/render.sh parrilla
"""

from sistema import FONDO_VELO, FONDO_VELO_INVERTIDO, dato, escribir, lista, pagina, preparar

T = 5
D = preparar(
    "parrilla",
    assets_public=[
        "clientes/parrilla-nortena/logo-arracheras.png",
        "clientes/parrilla-nortena/galeria-punto-de-venta.webp",
        "clientes/parrilla-nortena/galeria-caja-sucursal.webp",
        "clientes/parrilla-nortena/galeria-app-movil.webp",
    ],
    assets_propios=["assets/logo-claro.png"],
)
slides = {}

# 1. Portada: alianza de marcas, ambos logos en tarjeta blanca
slides[1] = pagina(1, T, """
<div style="position:absolute;top:185px;left:0;right:0;text-align:center;z-index:4">
 <span class="pill"><span class="dot"></span>Caso de éxito · De idea a realidad</span>
 <h1 style="margin-top:36px;font-size:112px">Parrilla Norteña<br><span class="grad">Soft</span></h1>
 <p class="p" style="margin:26px auto 0;width:820px">Control de operación diaria <b style="color:#C9B5F5">multisucursal</b>, hecho a la medida.</p>
</div>
<div style="position:absolute;top:760px;left:0;right:0;display:flex;justify-content:center;align-items:center;z-index:4">
 <div class="tarjeta-logo"><img src="logo-arracheras.png" style="width:300px"/></div>
 <div style="width:96px;height:96px;margin:0 -24px;border-radius:50%;background:#7836E2;display:flex;align-items:center;justify-content:center;font-size:52px;font-weight:300;box-shadow:0 0 50px 6px rgba(120,54,226,.7);position:relative;z-index:2">×</div>
 <div class="tarjeta-logo"><img src="logo-claro.png" style="width:310px"/></div>
</div>
<div style="position:absolute;top:1072px;left:0;right:0;text-align:center;z-index:4"><span class="pill"><span class="dot v"></span>En producción · 2 sucursales conectadas</span></div>
""", fondo=FONDO_VELO)

# 2. Multisucursal: texto + foto vertical
slides[2] = pagina(2, T, """
<div class="blob" style="width:640px;height:640px;right:-160px;top:300px"></div>
<div style="position:absolute;top:200px;left:72px;width:470px;z-index:4">
 <div class="eti">Multisucursal</div>
 <h2 style="margin-top:26px;font-size:72px">Todas las sucursales, <span class="grad">un solo sistema</span></h2>
 <p class="p" style="margin-top:24px;font-size:28px">Centraliza la toma de órdenes, el control de caja y la operación diaria del restaurante.</p>
 <div style="margin-top:34px">""" + lista([
    "Operación multisucursal centralizada",
    "Órdenes y caja en tiempo real",
    "De la orden al corte de caja, visible",
], 26) + """</div>
</div>
<div style="position:absolute;top:200px;right:72px;width:420px;height:860px;z-index:4" class="marco">
 <img src="galeria-punto-de-venta.webp" style="width:100%;height:100%;object-fit:cover"/>
 <div style="position:absolute;inset:auto 0 0 0;height:40%;background:linear-gradient(transparent,rgba(11,9,20,.9))"></div>
 <div style="position:absolute;left:26px;bottom:26px;display:flex;align-items:center;gap:14px;font-size:26px;font-weight:600"><span style="width:4px;height:32px;border-radius:4px;background:#7836E2;box-shadow:0 0 12px rgba(120,54,226,.8)"></span>Punto de venta en operación</div>
</div>
""")

# 3. Foto de caja + mockup de la app
slides[3] = pagina(3, T, """
<div class="blob" style="width:700px;height:700px;left:190px;top:560px"></div>
<div style="position:absolute;top:190px;left:72px;right:72px;z-index:4;text-align:center">
 <div class="eti" style="justify-content:center">En piso y en móvil <span style="width:48px;height:2px;background:#7836E2"></span></div>
 <h2 style="margin-top:26px;font-size:84px">De la caja <span class="grad">a tu bolsillo</span></h2>
 <p class="p" style="margin:22px auto 0;width:820px;font-size:30px">Control de caja en cada sucursal y la operación a la mano con la app para iOS y Android.</p>
</div>
<div style="position:absolute;top:600px;left:110px;width:400px;z-index:4">
 <div class="marco" style="height:520px"><img src="galeria-caja-sucursal.webp" style="width:100%;height:100%;object-fit:cover"/></div>
 <p style="margin-top:22px;text-align:center;font-size:26px;font-weight:600;color:rgba(255,255,255,.85)">Caja en sucursal</p>
</div>
<div style="position:absolute;top:585px;right:110px;width:400px;z-index:4;text-align:center">
 <div style="height:535px;display:flex;justify-content:center;background:radial-gradient(circle at 50% 55%,rgba(120,54,226,.35),transparent 65%)"><img src="galeria-app-movil.webp" style="height:100%;filter:drop-shadow(0 30px 40px rgba(0,0,0,.7))"/></div>
 <p style="margin-top:22px;font-size:26px;font-weight:600;color:rgba(255,255,255,.85)">App móvil iOS y Android</p>
</div>
""")

# 4. Resultados: solo datos reales publicados en el sitio
slides[4] = pagina(4, T, """
<div class="blob" style="width:620px;height:620px;left:-200px;top:520px"></div>
<div style="position:absolute;top:300px;left:72px;right:72px;z-index:4">
 <span class="pill"><span class="dot v"></span>En producción · 2026</span>
 <h2 style="margin-top:32px;font-size:84px">Resultados que <span class="grad">se operan a diario</span></h2>
 <div style="margin-top:50px;display:flex;gap:22px">""" + dato("2", "sucursales conectadas") + dato("1", "sistema para toda la operación") + dato("2026", "en producción") + """</div>
 <div style="margin-top:44px">""" + lista([
    "Operación multisucursal centralizada en un solo sistema",
    "Toma de órdenes y control de caja en tiempo real",
    "Menos merma y errores por captura manual",
], 28) + """</div>
</div>
""")

# 5. Cierre
slides[5] = pagina(5, T, """
<div style="position:absolute;top:290px;left:0;right:0;text-align:center;z-index:4">
 <div class="eti" style="justify-content:center">Tu negocio es el siguiente <span style="width:48px;height:2px;background:#7836E2"></span></div>
 <h2 style="margin:34px auto 0;width:940px;font-size:96px">¿Tu negocio necesita <span class="grad">su propio sistema?</span></h2>
 <p class="p" style="margin:32px auto 0;width:800px">Lo diseñamos alrededor de cómo operas tú, igual que con Parrilla Norteña Soft.</p>
 <div class="boton" style="margin-top:56px">Agenda tu consulta gratuita →</div>
 <p style="margin-top:28px;font-size:26px;color:rgba(255,255,255,.6)">Cotización gratuita y sin compromiso</p>
</div>""", fondo=FONDO_VELO_INVERTIDO, desliza=False)

escribir(D, slides)
