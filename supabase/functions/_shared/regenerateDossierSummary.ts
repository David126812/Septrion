// Shared function — regenerate dossier AI summary from full context
// Called when a signalement is attached to an existing dossier

export interface DossierContext {
  name: string;
  urgency: string;
  status: string;
  timeline: any[];
  documents: any[];
  signalements: { name: string; summary: string; urgency: string; location: string | null }[];
}

export interface RegeneratedSummary {
  summary: string;
  nextStep: string;
  urgency: string;
}

const REGENERATE_PROMPT = `Tu es un assistant pour un conseil syndical de copropriété.

Voici le contexte complet d'un dossier. Génère un résumé à jour qui intègre TOUTES les informations.

Réponds UNIQUEMENT en JSON valide :
{
  "summary": "Résumé factuel intégrant tous les signalements et événements (3-5 phrases)",
  "nextStep": "Prochaine action concrète recommandée",
  "urgency": "normal" ou "urgent" ou "critique"
}`;

export async function regenerateDossierSummary(
  anthropicApiKey: string,
  context: DossierContext,
): Promise<RegeneratedSummary> {
  try {
    const contextText = `
Dossier : "${context.name}"
Statut : ${context.status}
Urgence actuelle : ${context.urgency}

Signalements rattachés (${context.signalements.length}) :
${context.signalements.map((s, i) => `${i + 1}. "${s.name}" — ${s.summary} (urgence: ${s.urgency}${s.location ? `, localisation: ${s.location}` : ""})`).join("\n")}

Timeline :
${context.timeline.map((t: any) => `- ${t.date}: ${t.label} ${t.done ? "✓" : "○"}`).join("\n")}
`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        messages: [{ role: "user", content: contextText + "\n\n" + REGENERATE_PROMPT }],
      }),
    });

    const data = await res.json();
    if (data.content?.[0]?.text) {
      const parsed = JSON.parse(
        data.content[0].text.replace(/```json\n?|\n?```/g, "").trim()
      );
      return {
        summary: parsed.summary || context.name,
        nextStep: parsed.nextStep || "À qualifier",
        urgency: parsed.urgency || context.urgency,
      };
    }
  } catch (e) {
    console.error("Regenerate summary failed:", e);
  }

  // Fallback — keep existing
  return {
    summary: `${context.name} — ${context.signalements.length} signalement(s) rattaché(s)`,
    nextStep: "À examiner par le conseil syndical",
    urgency: context.urgency,
  };
}
