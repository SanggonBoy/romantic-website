import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const runtime = "nodejs";

interface ResponseBody {
  name: string;
  field: string;
  value: string;
}

export async function POST(request: Request) {
  try {
    const body: ResponseBody = await request.json();
    const { name, field, value } = body;

    if (!name || !field || !value) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const fieldLabels: Record<string, string> = {
      status: "Relationship Status",
      finalAnswer: "Final Answer",
      entered: "Entered the Site",
    };

    const valueLabels: Record<string, string> = {
      single: "Single (not with anyone)",
      taken: "With someone",
      yes: "Said YES",
      thinking: "Needs time to think",
      no: "Said no",
    };

    const subject = `[Crush Site] ${name} — ${
      field === "finalAnswer"
        ? valueLabels[value] || value
        : fieldLabels[field] || field
    }`;

    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #faf6f0; margin: 0; padding: 40px 20px; }
            .container { max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
            .label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 4px; }
            .value { font-size: 16px; color: #2a1818; margin-bottom: 20px; font-weight: 500; }
            .divider { border: none; border-top: 1px solid #f2e8dc; margin: 20px 0; }
            .highlight { font-size: 20px; color: #c8536a; font-weight: 600; }
            .timestamp { font-size: 13px; color: #aaa; margin-top: 24px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="label">Name</div>
            <div class="value highlight">${name}</div>
            <hr class="divider" />
            <div class="label">${fieldLabels[field] || field}</div>
            <div class="value">${valueLabels[value] || value}</div>
            <div class="timestamp">${timestamp} (Asia/Jakarta)</div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.NOTIFY_EMAIL_TO || process.env.GMAIL_USER,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email notification failed:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
