import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import type { ContactFormData } from '@/types';
import { execute } from '@/lib/neon/client';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'herbertprempeh@gmail.com';
const WA_DISPLAY  = '+233 059 975 4270';

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

    // ── Log to Neon DB (non-blocking) ────────────────────────
    try {
      await execute(
        `INSERT INTO contact_submissions (name, email, phone, message, type, status)
         VALUES ($1, $2, $3, $4, $5, 'unread')`,
        [
          body.name.trim(),
          body.email.trim(),
          (body.phone ?? '').trim() || null,
          body.message.trim(),
          body.type ?? 'other',
        ]
      );
    } catch (dbErr) {
      console.error('[DB] Failed to log contact submission:', dbErr);
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.error('Email credentials not configured.');
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

    await transporter.sendMail({
      from:    `"Milehigh5280 Website" <${process.env.GMAIL_USER}>`,
      to:      ADMIN_EMAIL,
      replyTo: body.email,
      subject: `📩 [${typeLabels[body.type] ?? 'Enquiry'}] New message from ${body.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;background:#111;color:#F5F0E8;padding:32px;border:1px solid rgba(201,150,58,0.2);">
          <h2 style="color:#C9963A;margin-top:0;">🌴 New Contact Enquiry</h2>
          <p><strong>Name:</strong> ${body.name}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <p><strong>Phone:</strong> ${body.phone || '—'}</p>
          <p><strong>Type:</strong> ${typeLabels[body.type] || body.type}</p>
          <hr style="border-color:rgba(201,150,58,0.2);"/>
          <p style="white-space:pre-wrap;">${body.message}</p>
        </div>
      `,
    });

    await transporter.sendMail({
      from:    `"Milehigh5280 🌴" <${process.env.GMAIL_USER}>`,
      to:      body.email,
      subject: `We received your message — Milehigh5280`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;background:#111;color:#F5F0E8;padding:32px;">
          <h2 style="color:#C9963A;">Thank you, ${body.name.split(' ')[0]}!</h2>
          <p>We've received your inquiry and will get back to you within 2 hours.</p>
          <p>For faster assistance, reach us on WhatsApp: <strong style="color:#C9963A;">${WA_DISPLAY}</strong></p>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err: unknown) {
    console.error('Contact email error:', err);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
