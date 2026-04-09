import { analyzeMessage } from "../_shared/analyzeMessage.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { document_url, mime_type, text } = await req.json();

    if (!document_url && !text) {
      return new Response(JSON.stringify({ success: false, error: { code: "INVALID_PARAMS", message: "document_url or text required" } }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    // Download document if URL provided
    let mediaBuffer: ArrayBuffer | undefined;
    let mediaMimeType: string | undefined;

    if (document_url) {
      try {
        const res = await fetch(document_url);
        if (res.ok) {
          mediaBuffer = await res.arrayBuffer();
          mediaMimeType = mime_type || res.headers.get("content-type") || "application/octet-stream";
        }
      } catch (e) {
        console.error("Document download failed:", e);
      }
    }

    const analysis = await analyzeMessage(ANTHROPIC_API_KEY, text || "", mediaBuffer, mediaMimeType);

    return new Response(JSON.stringify({ success: true, data: analysis }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("analyze-document error:", error);
    return new Response(JSON.stringify({ success: false, error: { code: "ANALYSIS_FAILED", message: String(error) } }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
});
