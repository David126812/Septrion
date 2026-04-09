import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendWhatsApp } from "../_shared/sendWhatsApp.ts";
import { sendEmail } from "../_shared/sendEmail.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const WHATSAPP_ACCESS_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN")!;
const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { copro_id, title, urgency, type } = await req.json();

    if (!copro_id || !title) {
      return new Response(JSON.stringify({ success: false, error: { code: "INVALID_PARAMS", message: "copro_id and title required" } }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    // Get all profiles for this copro with notification consent
    const { data: profiles } = await supabase
      .from("profiles")
      .select("whatsapp_phone, email, notification_consent")
      .eq("copro_id", copro_id)
      .eq("notification_consent", true);

    if (!profiles || profiles.length === 0) {
      return new Response(JSON.stringify({ success: true, data: { sent: 0, reason: "no_consented_profiles" } }), {
        status: 200, headers: { "Content-Type": "application/json" },
      });
    }

    let whatsappSent = 0;
    let emailSent = 0;

    const notifType = type || "signalement";
    const message = notifType === "digest"
      ? `📋 Septrion — Digest hebdo\n\n${title}`
      : `📌 Nouveau signalement : "${title}"\nUrgence : ${urgency || "normal"}\n\nOuvrez l'app pour qualifier.`;

    const emailSubject = notifType === "digest"
      ? "Septrion — Votre digest hebdo"
      : `Septrion — Nouveau signalement : ${title}`;

    for (const profile of profiles) {
      // Send WhatsApp
      if (profile.whatsapp_phone) {
        const sent = await sendWhatsApp(WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, profile.whatsapp_phone, message);
        if (sent) whatsappSent++;
      }

      // Send Email
      if (profile.email && RESEND_API_KEY) {
        const sent = await sendEmail(RESEND_API_KEY, profile.email, emailSubject, message);
        if (sent) emailSent++;
      }
    }

    return new Response(JSON.stringify({ success: true, data: { whatsappSent, emailSent } }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("send-notification error:", error);
    return new Response(JSON.stringify({ success: false, error: { code: "INTERNAL_ERROR", message: String(error) } }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
});
