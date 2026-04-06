import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import type { ContactFormData } from '@/types';

// ─── Admin inbox — all emails land here ──────────────────────────────────────
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'nyaaba.augustine@gmail.com';

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactFormData = await req.json();

    if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.error('GMAIL_USER or GMAIL_PASS not set in environment variables.');
      return NextResponse.json({ error: 'Email service not configured.' }, { status: 503 });
    }

    const transporter = createTransporter();

    const typeLabels: Record<string, string> = {
      booking:   'Property Booking',
      concierge: 'Concierge Request',
      event:     'Event / Group Stay',
      listing:   'List a Property',
      other:     'General Enquiry',
    };

    // 1️⃣ Admin notification → nyaaba.augustine@gmail.com
    await transporter.sendMail({
      from:    `"Milehigh5280 Website" <${process.env.GMAIL_USER}>`,
      to:      ADMIN_EMAIL,
      replyTo: body.email,
      subject: `📩 [${typeLabels[body.type] ?? 'Enquiry'}] New message from ${body.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;background:#111;color:#F5F0E8;padding:32px;border:1px solid rgba(201,150,58,0.2);">
          <h2 style="color:#C9963A;margin-top:0;">🌴 New Contact Enquiry — Milehigh5280</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#888;width:120px;">Type</td><td style="color:#F5F0E8;">${typeLabels[body.type] ?? body.type}</td></tr>
            <tr><td style="padding:8px 0;color:#888;">Name</td><td style="color:#F5F0E8;">${body.name}</td></tr>
            <tr><td style="padding:8px 0;color:#888;">Email</td><td><a href="mailto:${body.email}" style="color:#C9963A;">${body.email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#888;">Phone</td><td style="color:#F5F0E8;">${body.phone || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#888;">Property</td><td style="color:#F5F0E8;">${body.property || 'Any'}</td></tr>
          </table>
          <hr style="border-color:rgba(201,150,58,0.2);margin:20px 0;"/>
          <p style="color:#888;font-size:12px;margin-bottom:8px;">MESSAGE</p>
          <p style="color:#ccc;line-height:1.7;background:#1a1a1a;padding:16px;border-left:2px solid #C9963A;">${body.message.replace(/\n/g, '<br/>')}</p>
          <a href="mailto:${body.email}?subject=Re: Your enquiry — Milehigh5280" style="display:inline-block;margin-top:20px;background:linear-gradient(135deg,#C9963A,#E4B429);color:#080808;padding:12px 24px;text-decoration:none;font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.1em;">
            Reply to ${body.name.split(' ')[0]}
          </a>
          <p style="margin-top:24px;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:.1em;">Milehigh5280 🌴 · Ayi Mensah, Accra · milehigh5280.com</p>
        </div>
      `,
      text: `New ${body.type} enquiry from ${body.name} (${body.email})\nPhone: ${body.phone}\nProperty: ${body.property}\n\nMessage:\n${body.message}`,
    });

    // 2️⃣ Auto-reply to guest
    await transporter.sendMail({
      from:    `"Milehigh5280 🌴" <${process.env.GMAIL_USER}>`,
      to:      body.email,
      subject: `We received your message — Milehigh5280, Ayi Mensah`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;background:#111;color:#F5F0E8;padding:32px;border:1px solid rgba(201,150,58,0.2);">
          <h2 style="color:#C9963A;margin-top:0;">Thank you, ${body.name.split(' ')[0]}! 🌴</h2>
          <p style="color:#ccc;line-height:1.8;">We have received your message and will respond within <strong style="color:#F5F0E8;">2 hours</strong>. For faster assistance, reach us on WhatsApp:</p>
          <a href="https://wa.me/233541988383" style="display:inline-block;background:#25D366;color:#fff;padding:12px 24px;text-decoration:none;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.1em;margin-top:8px;">Chat on WhatsApp</a>
          <hr style="border-color:rgba(201,150,58,0.2);margin:24px 0;"/>
          <p style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:.1em;">Milehigh5280 🌴 · Ayi Mensah, Accra, Ghana</p>
        </div>
      `,
      text: `Hi ${body.name.split(' ')[0]},\n\nThank you for reaching out! We've received your message and will get back to you within 2 hours.\n\nWhatsApp: +233 54 198 8383\n\n— The Milehigh5280 Team`,
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err: unknown) {
    console.error('Contact email error:', err);
    return NextResponse.json({ error: 'Failed to send message. Please contact us via WhatsApp.' }, { status: 500 });
  }
}
