"use server";

import { Resend } from "resend";

// Validamos la existencia de la API Key antes de inicializar para evitar fallos silenciosos
if (!process.env.RESEND_API_KEY) {
  console.error(
    "🚨 CRÍTICO: La variable de entorno RESEND_API_KEY no está definida.",
  );
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  // Logs iniciales para verificar qué datos están llegando desde el formulario del cliente
  console.log("======= 🚀 INICIANDO SERVER ACTION: sendContactEmail =======");

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  console.log("📝 Datos recibidos en el servidor:", { name, email, message });

  // 1. Validación de campos obligatorios
  if (!name || !email || !message) {
    console.warn("⚠️ Validación fallida: Faltan campos obligatorios.");
    return {
      success: false,
      error: "Todos los campos son requeridos en el servidor.",
    };
  }

  // 2. Validación de la API Key en tiempo de ejecución
  if (!process.env.RESEND_API_KEY) {
    console.error(
      "🚨 Error: Intentando enviar correo sin una API Key configurada.",
    );
    return {
      success: false,
      error:
        "Error de configuración interna: Falta la API Key en el servidor de Vercel.",
    };
  }

  try {
    console.log("📨 Intentando conectar con la API de Resend...");

    // Ejecutamos la petición a Resend
    const response = await resend.emails.send({
      from: "Formulario Web <onboarding@resend.dev>",
      to: ["barcenasrosalescesarivan@gmail.com"], // 👈 ASEGÚRATE DE QUE ESTE SEA EL MISMO CORREO CON EL QUE TE REGISTRASTE
      subject: `📩 Nuevo mensaje de ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #111; margin-bottom: 20px;">Tienes un nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Correo del usuario:</strong> ${email}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Mensaje:</strong></p>
          <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 5px; color: #333;">${message}</p>
        </div>
      `,
    });

    console.log(
      "📡 Respuesta cruda recibida de Resend:",
      JSON.stringify(response),
    );

    // Validamos la respuesta específica del SDK de Resend
    if (response.error) {
      console.error("❌ Resend rechazó el envío:", response.error);
      return {
        success: false,
        error: `Resend Error [${response.error.name}]: ${response.error.message}`,
      };
    }

    console.log(
      "✅ ¡Correo enviado exitosamente! ID de Resend:",
      response.data?.id,
    );
    console.log("=======================================================");

    return { success: true };
  } catch (catchError: any) {
    // Captura fallos críticos como problemas de red o caídas del servicio
    console.error("💥 ERROR CRÍTICO CRASH EN EL TRY/CATCH:");
    console.error("- Nombre del Error:", catchError?.name || "Desconocido");
    console.error("- Mensaje de Error:", catchError?.message || "Sin mensaje");
    console.error("- Stack Trace:", catchError?.stack || "No disponible");
    console.log("=======================================================");

    return {
      success: false,
      error: `Fallo crítico en el servidor: ${catchError?.message || "Revisa los logs de Vercel."}`,
    };
  }
}
