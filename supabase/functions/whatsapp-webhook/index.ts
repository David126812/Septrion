import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { analyzeMessage } from "../_shared/analyzeMessage.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const WHATSAPP_VERIFY_TOKEN = Deno.env.get("WHATSAPP_VERIFY_TOKEN")!;
const WHATSAPP_ACCESS_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN")!;
const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID")!;
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ============================================
// WhatsApp webhook verification
// ============================================
function handleVerification(url: URL): Response {
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

// ============================================
// Download media from WhatsApp
// ============================================
async function downloadMedia(mediaId: string): Promise<{ buffer: ArrayBuffer; mimeType: string }> {
  const metaRes = await fetch(`https://graph.facebook.com/v21.0/${mediaId}`, {
    headers: { Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}` },
  });
  const metaData = await metaRes.json();
  if (metaData.error) throw new Error(`Meta API: ${metaData.error.message}`);

  const fileRes = await fetch(metaData.url, {
    headers: { Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}` },
  });
  if (!fileRes.ok) throw new Error(`Download failed: ${fileRes.status}`);

  return { buffer: await fileRes.arrayBuffer(), mimeType: metaData.mime_type || "application/octet-stream" };
}

// ============================================
// Upload to Supabase Storage
// ============================================
async function uploadToStorage(buffer: ArrayBuffer, mimeType: string, filename: string): Promise<string> {
  const ext = mimeType.includes("pdf") ? "pdf" : mimeType.includes("image") ? "jpg" : "bin";
  const path = `documents/${Date.now()}_${filename}.${ext}`;
  const { error } = await supabase.storage.from("Copro bucket").upload(path, buffer, { contentType: mimeType });
  if (error) throw new Error(`Storage: ${error.message}`);
  return supabase.storage.from("Copro bucket").getPublicUrl(path).data.publicUrl;
}

// ============================================
// Match sender phone → copro_id via profiles
// ============================================
async function findCoproByPhone(phone: string): Promise<string | null> {
  // Normalize phone: remove spaces, ensure + prefix
  const normalized = phone.replace(/\s/g, "");

  const { data } = await supabase
    .from("profiles")
    .select("copro_id")
    .eq("whatsapp_phone", normalized)
    .maybeSingle();

  if (data?.copro_id) return data.copro_id;

  // Try without + prefix
  const withoutPlus = normalized.startsWith("+") ? normalized.slice(1) : normalized;
  const { data: data2 } = await supabase
    .from("profiles")
    .select("copro_id")
    .eq("whatsapp_phone", withoutPlus)
    .maybeSingle();

  return data2?.copro_id || null;
}

// ============================================
// Create signalement with copro_id + location
// ============================================
async function createSignalement(
  analysis: { name: string; urgency: string; location: string | null; nextStep: string; summary: string },
  copro_id: string | null,
  documentUrl?: string,
  senderName?: string,
  senderPhone?: string,
): Promise<string> {
  const { data, error } = await supabase.from("signalements").insert({
    name: analysis.name,
    urgency: analysis.urgency,
    location: analysis.location,
    summary: analysis.summary,
    next_step: analysis.nextStep,
    sender_name: senderName || null,
    sender_phone: senderPhone || null,
    document_url: documentUrl || null,
    status: "nouveau",
    copro_id: copro_id,
    raw_analysis: analysis,
  }).select("id").single();

  if (error) throw new Error(`Insert signalement failed: ${error.message}`);
  return data.id;
}

// ============================================
// Send WhatsApp reply
// ============================================
async function sendTextReply(to: string, text: string) {
  const res = await fetch(`https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}` },
    body: JSON.stringify({ messaging_product: "whatsapp", to, type: "text", text: { body: text } }),
  });
  const data = await res.json();
  console.log("WhatsApp send result:", JSON.stringify(data));
  return data;
}

// ============================================
// Main handler
// ============================================
Deno.serve(async (req) => {
  const url = new URL(req.url);
  if (req.method === "GET") return handleVerification(url);

  if (req.method === "POST") {
    try {
      const body = await req.json();

      // === WhatsApp webhook ===
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const message = change?.value?.messages?.[0];
      if (!message) return new Response("OK", { status: 200 });

      const senderPhone = message.from;
      const senderName = change?.value?.contacts?.[0]?.profile?.name || "";

      // Skip replies (OUI/NON) — simplified for MVP
      const textBody = message.text?.body?.trim().toUpperCase() || "";
      if (message.type === "text" && (textBody === "OUI" || textBody === "NON")) {
        return new Response("OK", { status: 200 });
      }

      // --- Match sender to copro ---
      const copro_id = await findCoproByPhone(senderPhone);
      if (!copro_id) {
        console.log(`Unknown sender: ${senderPhone} — no matching profile`);
        await sendTextReply(senderPhone, "Votre numéro n'est pas associé à un compte Septrion. Inscrivez-vous sur l'app d'abord.");
        return new Response("OK", { status: 200 });
      }

      // --- Extract text and media ---
      let text = "";
      if (message.type === "text") {
        text = message.text?.body || "";
      } else if (message.type === "document" || message.type === "image") {
        text = message[message.type]?.caption || "";
      }

      let documentUrl: string | undefined;
      let mediaBuffer: ArrayBuffer | undefined;
      let mediaMimeType: string | undefined;
      const mediaId = message.document?.id || message.image?.id;

      if (mediaId) {
        try {
          const media = await downloadMedia(mediaId);
          mediaBuffer = media.buffer;
          mediaMimeType = media.mimeType;
          documentUrl = await uploadToStorage(media.buffer, media.mimeType, mediaId);
        } catch (e) {
          console.error("Media failed:", e);
        }
      }

      // --- Analyze with shared pipeline ---
      const analysis = await analyzeMessage(ANTHROPIC_API_KEY, text, mediaBuffer, mediaMimeType);
      console.log("Analysis:", JSON.stringify(analysis));

      // --- Create signalement with copro_id ---
      const signalementId = await createSignalement(analysis, copro_id, documentUrl, senderName, senderPhone);
      console.log(`Signalement created: ${signalementId} — "${analysis.name}" — copro: ${copro_id}`);

      // --- Reply to sender ---
      const locationInfo = analysis.location ? `\nLocalisation : ${analysis.location}` : "";
      await sendTextReply(senderPhone,
        `Signalement reçu : "${analysis.name}"\nUrgence : ${analysis.urgency}${locationInfo}\n\nLe conseil syndical va qualifier ce signalement.`
      );

      return new Response(JSON.stringify({ success: true, signalementId }), {
        status: 200, headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Webhook error:", error);
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 200, headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response("Method not allowed", { status: 405 });
});
