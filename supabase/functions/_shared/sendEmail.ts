// Shared helper — send email via Resend API

export async function sendEmail(
  resendApiKey: string,
  to: string,
  subject: string,
  body: string,
): Promise<boolean> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Septrion <notifications@septrion.app>",
        to: [to],
        subject,
        text: body,
      }),
    });
    const data = await res.json();
    console.log("Email send:", JSON.stringify(data));
    return !data.error;
  } catch (e) {
    console.error("sendEmail failed:", e);
    return false;
  }
}
