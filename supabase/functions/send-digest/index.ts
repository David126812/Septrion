import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendWhatsApp } from "../_shared/sendWhatsApp.ts";
import { sendEmail } from "../_shared/sendEmail.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const WHATSAPP_ACCESS_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN")!;
const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { copro_id } = await req.json();
    if (!copro_id) {
      return new Response(JSON.stringify({ success: false, error: { code: "INVALID_PARAMS", message: "copro_id required" } }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    // Get dossiers and signalements for this copro
    const { data: dossiers } = await supabase.from("dossiers").select("name, status, urgency, next_step").eq("copro_id", copro_id);
    const { data: signalements } = await supabase.from("signalements").select("name, urgency").eq("copro_id", copro_id).eq("status", "nouveau");

    const actifs = (dossiers || []).filter((d: any) => d.status === "en_cours");
    const bloques = (dossiers || []).filter((d: any) => d.status === "bloque");
    const enAttente = signalements || [];

    // Generate AI summary
    let digestText: string;
    try {
      const context = `
Dossiers actifs (${actifs.length}) : ${actifs.map((d: any) => `"${d.name}" (${d.urgency})`).join(", ") || "aucun"}
Dossiers bloqués (${bloques.length}) : ${bloques.map((d: any) => `"${d.name}" — ${d.next_step || "en attente"}`).join(", ") || "aucun"}
Signalements en attente (${enAttente.length}) : ${enAttente.map((s: any) => `"${s.name}"`).join(", ") || "aucun"}
`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 300,
          messages: [{
            role: "user",
            content: `${context}\n\nGénère un digest hebdomadaire en 3-5 lignes pour le conseil syndical. Sois factuel et actionable. Réponds en texte brut (pas de JSON).`,
          }],
        }),
      });

      const data = await res.json();
      digestText = data.content?.[0]?.text || `${actifs.length} dossier(s) actif(s), ${bloques.length} bloqué(s), ${enAttente.length} signalement(s) en attente.`;
    } catch {
      digestText = `${actifs.length} dossier(s) actif(s), ${bloques.length} bloqué(s), ${enAttente.length} signalement(s) en attente.`;
    }

    // Send to all consented profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("whatsapp_phone, email, notification_consent")
      .eq("copro_id", copro_id)
      .eq("notification_consent", true);

    let whatsappSent = 0;
    let emailSent = 0;

    for (const profile of (profiles || [])) {
      if (profile.whatsapp_phone) {
        const sent = await sendWhatsApp(WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, profile.whatsapp_phone, `📋 Digest Septrion\n\n${digestText}`);
        if (sent) whatsappSent++;
      }
      if (profile.email && RESEND_API_KEY) {
        const sent = await sendEmail(RESEND_API_KEY, profile.email, "Septrion — Votre digest hebdo", digestText);
        if (sent) emailSent++;
      }
    }

    return new Response(JSON.stringify({ success: true, data: { digestText, whatsappSent, emailSent } }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("send-digest error:", error);
    return new Response(JSON.stringify({ success: false, error: { code: "INTERNAL_ERROR", message: String(error) } }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
});
