import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import type { ContactFormData } from '@/types';

// ─── Admin email (your inbox) ─────────────────────────────────────────────────
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'herbertprempeh@gmail.com';

// ─── Build a Gmail SMTP transporter ──────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,   // e.g. herbertprempeh@gmail.com
      pass: process.env.GMAIL_PASS,   // 16-char App Password from Google
    },
  });
}

// ─── Email templates ──────────────────────────────────────────────────────────

/** HTML email sent to admin (nyaaba.augustine@gmail.com) */
function adminEmailHtml(data: ContactFormData): string {
  const typeLabels: Record<string, string> = {
    booking:   '🏠 Property Booking',
    concierge: '🔔 Concierge Request',
    event:     '🎉 Event / Group Stay',
    listing:   '📋 List a Property',
    other:     '✉️ General Enquiry',
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Enquiry — Milehigh5280</title>
  <style>
    body { margin:0; padding:0; background:#080808; font-family:'Helvetica Neue',Arial,sans-serif; color:#F5F0E8; }
    .wrapper { max-width:600px; margin:0 auto; background:#111111; border:1px solid rgba(201,150,58,0.2); }
    .header { background:linear-gradient(135deg,#C9963A 0%,#E4B429 50%,#C9963A 100%); padding:32px 40px; }
    .header h1 { margin:0; color:#080808; font-size:22px; font-weight:700; letter-spacing:0.05em; }
    .header p { margin:6px 0 0; color:#080808; opacity:0.7; font-size:13px; letter-spacing:0.1em; text-transform:uppercase; }
    .body { padding:40px; }
    .badge { display:inline-block; background:rgba(201,150,58,0.15); border:1px solid rgba(201,150,58,0.3); color:#C9963A; font-size:12px; padding:4px 12px; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:24px; }
    .field { margin-bottom:20px; }
    .label { font-size:10px; text-transform:uppercase; letter-spacing:0.2em; color:#888; margin-bottom:4px; }
    .value { font-size:15px; color:#F5F0E8; background:#1a1a1a; padding:12px 16px; border-left:2px solid #C9963A; }
    .message-box { font-size:14px; color:#ccc; background:#1a1a1a; padding:16px; border-left:2px solid #C9963A; line-height:1.7; white-space:pre-wrap; }
    .footer { padding:24px 40px; border-top:1px solid rgba(201,150,58,0.15); text-align:center; }
    .footer p { margin:0; font-size:11px; color:#555; letter-spacing:0.1em; text-transform:uppercase; }
    .footer a { color:#C9963A; text-decoration:none; }
    .divider { height:1px; background:linear-gradient(90deg,transparent,rgba(201,150,58,0.3),transparent); margin:24px 0; }
    .cta { display:inline-block; background:linear-gradient(135deg,#C9963A,#E4B429); color:#080808; padding:12px 28px; font-size:13px; font-weight:700; text-decoration:none; letter-spacing:0.1em; text-transform:uppercase; margin-top:24px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🌴 Milehigh5280 · New Enquiry</h1>
      <p>Milehigh Properties · Ayi Mensah, Accra</p>
    </div>
    <div class="body">
      <div class="badge">${typeLabels[data.type] ?? '✉️ Enquiry'}</div>

      <div class="field">
        <div class="label">From</div>
        <div class="value">${data.name}</div>
      </div>

      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${data.email}" style="color:#C9963A;">${data.email}</a></div>
      </div>

      ${data.phone ? `
      <div class="field">
        <div class="label">Phone / WhatsApp</div>
        <div class="value"><a href="tel:${data.phone}" style="color:#C9963A;">${data.phone}</a></div>
      </div>` : ''}

      ${data.property ? `
      <div class="field">
        <div class="label">Property of Interest</div>
        <div class="value">${data.property}</div>
      </div>` : ''}

      <div class="divider"></div>

      <div class="field">
        <div class="label">Message</div>
        <div class="message-box">${data.message}</div>
      </div>

      <a class="cta" href="mailto:${data.email}?subject=Re: Your Enquiry — Milehigh5280">
        Reply to ${data.name.split(' ')[0]}
      </a>
    </div>
    <div class="footer">
      <p>Received via <a href="https://milehigh5280.com">milehigh5280.com</a> · ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Accra' })} GMT</p>
    </div>
  </div>
</body>
</html>`;
}

/** Plain text auto-reply sent to the guest */
function guestAutoReplyHtml(name: string): string {
  const firstName = name.split(' ')[0];
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <style>
    body { margin:0; padding:0; background:#080808; font-family:'Helvetica Neue',Arial,sans-serif; color:#F5F0E8; }
    .wrapper { max-width:600px; margin:0 auto; background:#111111; border:1px solid rgba(201,150,58,0.2); }
    .header { background:linear-gradient(135deg,#C9963A 0%,#E4B429 50%,#C9963A 100%); padding:32px 40px; }
    .header h1 { margin:0; color:#080808; font-size:22px; font-weight:700; }
    .header p { margin:6px 0 0; color:#080808; opacity:0.7; font-size:13px; text-transform:uppercase; letter-spacing:0.1em; }
    .body { padding:40px; }
    .body p { font-size:15px; color:#ccc; line-height:1.8; margin:0 0 16px; }
    .highlight { color:#C9963A; font-weight:600; }
    .info-box { background:#1a1a1a; border-left:2px solid #C9963A; padding:16px 20px; margin:24px 0; }
    .info-box p { margin:0; font-size:13px; color:#888; }
    .info-box strong { color:#F5F0E8; }
    .cta { display:inline-block; background:linear-gradient(135deg,#C9963A,#E4B429); color:#080808; padding:12px 28px; font-size:13px; font-weight:700; text-decoration:none; letter-spacing:0.1em; text-transform:uppercase; margin:16px 0; }
    .footer { padding:24px 40px; border-top:1px solid rgba(201,150,58,0.15); text-align:center; }
    .footer p { margin:0; font-size:11px; color:#555; letter-spacing:0.1em; text-transform:uppercase; }
    .footer a { color:#C9963A; text-decoration:none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🌴 Thank You, ${firstName}!</h1>
      <p>Milehigh5280 · Milehigh Properties</p>
    </div>
    <div class="body">
      <p>We have received your message and our team will get back to you <span class="highlight">within 2 hours</span> — often much sooner.</p>
      <p>In the meantime, feel free to reach us directly:</p>

      <div class="info-box">
        <p>📞 <strong>Phone / WhatsApp:</strong> +233 54 198 8383</p>
        <p style="margin-top:8px;">📧 <strong>Email:</strong> herbertprempeh@gmail.com</p>
        <p style="margin-top:8px;">📍 <strong>Location:</strong> Ayi Mensah, Accra, Ghana</p>
      </div>

      <p>For the fastest response, message us on WhatsApp:</p>
      <a class="cta" href="https://wa.me/233541988383?text=Hello%2C%20I%20just%20sent%20an%20enquiry%20on%20your%20website">
        Chat on WhatsApp
      </a>
    </div>
    <div class="footer">
      <p>Milehigh5280 🌴 · <a href="https://milehigh5280.com">milehigh5280.com</a></p>
      <p style="margin-top:4px;">Managed by Milehigh Properties · Ayi Mensah, Accra</p>
    </div>
  </div>
</body>
</html>`;
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body: ContactFormData = await req.json();

    // Basic validation
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // Verify SMTP credentials are set
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.error('GMAIL_USER or GMAIL_PASS not set in .env.local');
      return NextResponse.json(
        { error: 'Email service not configured. Please contact us via WhatsApp.' },
        { status: 503 },
      );
    }

    const transporter = createTransporter();

    const typeLabels: Record<string, string> = {
      booking: 'Property Booking', concierge: 'Concierge Request',
      event: 'Event/Group Stay', listing: 'List Property', other: 'General',
    };

    // 1️⃣ Send notification to admin
    await transporter.sendMail({
      from:    `"Milehigh5280 Website" <${process.env.GMAIL_USER}>`,
      to:      ADMIN_EMAIL,
      replyTo: body.email,
      subject: `[${typeLabels[body.type] ?? 'Enquiry'}] New message from ${body.name}`,
      html:    adminEmailHtml(body),
      text:    `New enquiry from ${body.name} (${body.email})\nPhone: ${body.phone}\nType: ${body.type}\nProperty: ${body.property}\n\nMessage:\n${body.message}`,
    });

    // 2️⃣ Send auto-reply to guest
    await transporter.sendMail({
      from:    `"Milehigh5280 🌴" <${process.env.GMAIL_USER}>`,
      to:      body.email,
      subject: `We received your message — Milehigh5280 Ayi Mensah`,
      html:    guestAutoReplyHtml(body.name),
      text:    `Hi ${body.name.split(' ')[0]},\n\nThank you for reaching out! We've received your message and will get back to you within 2 hours.\n\nFor faster response: WhatsApp us at +233 54 198 8383\n\n— The Milehigh5280 Team`,
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err: unknown) {
    console.error('Contact API error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to send email: ${message}` }, { status: 500 });
  }
}
