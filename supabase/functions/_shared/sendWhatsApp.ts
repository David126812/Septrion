// Shared helper — send WhatsApp template message

export async function sendWhatsApp(
  accessToken: string,
  phoneNumberId: string,
  to: string,
  text: string,
): Promise<boolean> {
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      }),
    });
    const data = await res.json();
    console.log("WhatsApp send:", JSON.stringify(data));
    return !data.error;
  } catch (e) {
    console.error("sendWhatsApp failed:", e);
    return false;
  }
}
