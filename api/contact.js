const RECIPIENT_EMAIL = "mariadudinhaps@hotmail.com";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");

    return res.status(405).json({
      success: false,
      message: "Method not allowed."
    });
  }

  try {
    const {
      name,
      email,
      brand,
      project_type,
      location_dates,
      message,
      company_website
    } = req.body || {};

    /* ================================
       HONEYPOT
    ================================ */

    if (company_website) {
      return res.status(200).json({
        success: true
      });
    }

    /* ================================
       VALIDATION
    ================================ */

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields."
      });
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    if (
      String(name).length > 120 ||
      String(email).length > 254 ||
      String(brand || "").length > 180 ||
      String(location_dates || "").length > 180 ||
      String(message).length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more fields are too long."
      });
    }

    /* ================================
       EMAIL
    ================================ */

    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL,

          to: [
            RECIPIENT_EMAIL
          ],

          reply_to: email,

          subject: `New Duda Negrão enquiry — ${name}`,

          html: `
            <div style="background:#000;color:#f5f5f2;padding:40px;font-family:Arial,sans-serif;">
              <div style="max-width:680px;margin:0 auto;">
                <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#8f8f8c;margin-bottom:40px;">
                  DUDA NEGRÃO / PORTFOLIO
                </div>

                <h1 style="margin:0 0 40px;font-size:36px;font-weight:500;line-height:1;">
                  New Enquiry
                </h1>

                <div style="border-top:1px solid #333;">
                  <div style="padding:18px 0;border-bottom:1px solid #333;">
                    <strong>Name</strong><br>
                    ${escapeHtml(name)}
                  </div>

                  <div style="padding:18px 0;border-bottom:1px solid #333;">
                    <strong>Email</strong><br>
                    ${escapeHtml(email)}
                  </div>

                  <div style="padding:18px 0;border-bottom:1px solid #333;">
                    <strong>Brand / Agency</strong><br>
                    ${escapeHtml(brand || "Not provided")}
                  </div>

                  <div style="padding:18px 0;border-bottom:1px solid #333;">
                    <strong>Project Type</strong><br>
                    ${escapeHtml(project_type || "Not selected")}
                  </div>

                  <div style="padding:18px 0;border-bottom:1px solid #333;">
                    <strong>Location / Dates</strong><br>
                    ${escapeHtml(location_dates || "Not provided")}
                  </div>

                  <div style="padding:18px 0;border-bottom:1px solid #333;">
                    <strong>Project</strong><br><br>
                    ${escapeHtml(message).replaceAll("\n", "<br>")}
                  </div>
                </div>

                <div style="margin-top:40px;font-size:12px;color:#8f8f8c;">
                  Submitted through dudanegrao.com
                </div>
              </div>
            </div>
          `,

          text: `
New enquiry for Duda Negrão

Name:
${name}

Email:
${email}

Brand / Agency:
${brand || "Not provided"}

Project Type:
${project_type || "Not selected"}

Location / Dates:
${location_dates || "Not provided"}

Project:
${message}
          `.trim()
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Resend error:", result);

      return res.status(500).json({
        success: false,
        message: "Unable to send the enquiry."
      });
    }

    return res.status(200).json({
      success: true
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send the enquiry."
    });
  }
}