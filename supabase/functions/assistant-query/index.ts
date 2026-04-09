import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ASSISTANT_PROMPT = `Tu es l'assistant IA de Septrion, une app de gestion de copropriété pour le conseil syndical.

L'utilisateur te pose une question sur les dossiers de sa copropriété. Tu as accès au contexte complet ci-dessous.

Règles :
- Réponds de manière concise et factuelle (3-5 phrases max)
- Si tu identifies un dossier correspondant, mentionne son nom et son statut
- Si plusieurs dossiers correspondent, liste-les brièvement
- Si aucun dossier ne correspond, dis-le honnêtement
- Propose des actions concrètes quand c'est pertinent

Réponds en JSON :
{
  "response": "Ta réponse textuelle à l'utilisateur",
  "matched_dossiers": [{"id": "...", "name": "...", "status": "..."}],
  "suggested_actions": [{"type": "view_dossier|create_signalement", "label": "Texte du bouton", "target": "id_ou_route"}]
}

Si aucun dossier ne correspond : "matched_dossiers": [], "suggested_actions": [{"type": "create_signalement", "label": "Créer un signalement", "target": "/signaler-incident"}]`;

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Handle CORS for browser requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { question, copro_id } = await req.json();

    if (!question || !copro_id) {
      return new Response(JSON.stringify({ success: false, error: { code: "INVALID_PARAMS", message: "question and copro_id required" } }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    // Load all dossiers for this copro
    const { data: dossiers } = await supabase
      .from("dossiers")
      .select("id, name, status, urgency, next_step, last_action, timeline, blocage_reason")
      .eq("copro_id", copro_id)
      .order("updated_at", { ascending: false });

    // Load recent signalements
    const { data: signalements } = await supabase
      .from("signalements")
      .select("id, name, urgency, summary, status, location")
      .eq("copro_id", copro_id)
      .eq("status", "nouveau")
      .order("created_at", { ascending: false })
      .limit(10);

    // Build context
    const dossierContext = (dossiers || []).map((d: any) => {
      const lastEvent = (d.timeline || []).filter((t: any) => t.done).pop();
      return `- "${d.name}" [${d.status}] urgence:${d.urgency} — ${d.last_action || ""}${d.blocage_reason ? ` (bloqué: ${d.blocage_reason})` : ""}${lastEvent ? ` | dernier: ${lastEvent.label}` : ""}`;
    }).join("\n");

    const signalementContext = (signalements || []).map((s: any) =>
      `- "${s.name}" [${s.status}] urgence:${s.urgency}${s.location ? ` à ${s.location}` : ""} — ${s.summary || ""}`
    ).join("\n");

    const fullContext = `
DOSSIERS DE LA COPROPRIÉTÉ (${(dossiers || []).length}) :
${dossierContext || "Aucun dossier"}

SIGNALEMENTS EN ATTENTE (${(signalements || []).length}) :
${signalementContext || "Aucun signalement en attente"}
`;

    // Call Claude
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        messages: [{
          role: "user",
          content: `${fullContext}\n\nQuestion de l'utilisateur : "${question}"\n\n${ASSISTANT_PROMPT}`,
        }],
      }),
    });

    const data = await res.json();

    if (data.content?.[0]?.text) {
      try {
        const parsed = JSON.parse(data.content[0].text.replace(/```json\n?|\n?```/g, "").trim());
        return new Response(JSON.stringify({ success: true, data: parsed }), {
          status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      } catch {
        // If JSON parse fails, return raw text
        return new Response(JSON.stringify({
          success: true,
          data: {
            response: data.content[0].text,
            matched_dossiers: [],
            suggested_actions: [],
          },
        }), {
          status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    return new Response(JSON.stringify({ success: false, error: { code: "NO_RESPONSE", message: "AI returned no content" } }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("assistant-query error:", error);
    return new Response(JSON.stringify({ success: false, error: { code: "INTERNAL_ERROR", message: String(error) } }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
});
