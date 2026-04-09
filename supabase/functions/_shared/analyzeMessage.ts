// Shared AI analysis pipeline — used by whatsapp-webhook and analyze-document
// Produces: name, urgency, location (nullable), nextStep, summary

export interface AnalysisResult {
  name: string;
  urgency: "normal" | "urgent" | "critique";
  location: string | null;
  nextStep: string;
  summary: string;
}

const ANALYZE_PROMPT = `Tu es un assistant pour un conseil syndical de copropriété. Analyse le contenu envoyé.

Réponds UNIQUEMENT en JSON valide (pas de markdown) :
{
  "name": "Titre court et clair du dossier (ex: Réfection toiture Bât A, Panne portail parking B)",
  "urgency": "normal" ou "urgent" ou "critique",
  "location": "Localisation si détectable (ex: Ascenseur — Bâtiment B, Parking souterrain) ou null si non détectable",
  "nextStep": "Prochaine action concrète recommandée",
  "summary": "Résumé factuel en 2-3 phrases des points clés"
}

Règles d'urgence :
- "normal" : pas de deadline immédiate
- "urgent" : action requise sous 1 semaine (panne, fuite, blocage)
- "critique" : sécurité, dégât des eaux, incendie — action immédiate

Si l'entrée est uniquement une image, décris ce que tu vois et déduis le type de problème.
Si la localisation n'est pas mentionnée dans le contenu, mets "location": null.`;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

export async function analyzeMessage(
  anthropicApiKey: string,
  text: string,
  mediaBuffer?: ArrayBuffer,
  mediaMimeType?: string,
): Promise<AnalysisResult> {
  if (anthropicApiKey) {
    try {
      const content: any[] = [];

      if (mediaBuffer && mediaMimeType) {
        const b64 = arrayBufferToBase64(mediaBuffer);
        if (mediaMimeType.includes("pdf")) {
          content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } });
        } else if (mediaMimeType.includes("image")) {
          content.push({ type: "image", source: { type: "base64", media_type: mediaMimeType, data: b64 } });
        }
      }

      if (text) content.push({ type: "text", text: `Message : "${text}"` });
      content.push({ type: "text", text: ANALYZE_PROMPT });

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicApiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 800,
          messages: [{ role: "user", content }],
        }),
      });

      const data = await res.json();
      if (data.content?.[0]?.text) {
        const parsed = JSON.parse(
          data.content[0].text.replace(/```json\n?|\n?```/g, "").trim()
        );
        if (parsed.name) {
          return {
            name: parsed.name,
            urgency: parsed.urgency || "normal",
            location: parsed.location || null,
            nextStep: parsed.nextStep || "À qualifier par le conseil syndical",
            summary: parsed.summary || "",
          };
        }
      }
    } catch (e) {
      console.error("Claude analyze failed:", e);
    }
  }

  // Fallback — keyword-based analysis
  let urgency: "normal" | "urgent" | "critique" = "normal";
  const lower = text.toLowerCase();
  const urgentKeywords = ["panne", "fuite", "bloqué", "cassé", "urgent"];
  const critiqueKeywords = ["inondation", "incendie", "sécurité", "critique"];

  for (const kw of critiqueKeywords) {
    if (lower.includes(kw)) { urgency = "critique"; break; }
  }
  if (urgency === "normal") {
    for (const kw of urgentKeywords) {
      if (lower.includes(kw)) { urgency = "urgent"; break; }
    }
  }

  return {
    name: text.slice(0, 60) || "Signalement",
    urgency,
    location: null,
    nextStep: "À qualifier par le conseil syndical",
    summary: text,
  };
}
