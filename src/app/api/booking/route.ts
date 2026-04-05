import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import type { BookingEmailData } from '@/types';

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

function adminBookingHtml(d: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <style>
    body { margin:0; padding:0; background:#080808; font-family:'Helvetica Neue',Arial,sans-serif; color:#F5F0E8; }
    .wrapper { max-width:600px; margin:0 auto; background:#111111; border:1px solid rgba(201,150,58,0.2); }
    .header { background:linear-gradient(135deg,#C9963A,#E4B429,#C9963A); padding:32px 40px; }
    .header h1 { margin:0; color:#080808; font-size:22px; font-weight:700; }
    .header p  { margin:6px 0 0; color:#080808; opacity:0.7; font-size:13px; text-transform:uppercase; letter-spacing:.1em; }
    .body { padding:40px; }
    .total-box { background:rgba(201,150,58,0.1); border:1px solid rgba(201,150,58,0.4); padding:20px 24px; text-align:center; margin-bottom:28px; }
    .total-box .amount { font-size:36px; color:#C9963A; font-weight:300; font-family:Georgia,serif; }
    .total-box .label  { font-size:11px; color:#888; text-transform:uppercase; letter-spacing:.15em; }
    .grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; }
    .field { background:#1a1a1a; padding:14px 16px; border-left:2px solid #C9963A; }
    .field .lbl { font-size:10px; text-transform:uppercase; letter-spacing:.2em; color:#888; margin-bottom:4px; }
    .field .val { font-size:14px; color:#F5F0E8; }
    .special { background:#1a1a1a; border-left:2px solid #C9963A; padding:14px 16px; margin-bottom:24px; font-size:13px; color:#ccc; line-height:1.7; }
    .cta { display:inline-block; background:linear-gradient(135deg,#C9963A,#E4B429); color:#080808; padding:12px 28px; font-size:13px; font-weight:700; text-decoration:none; letter-spacing:.1em; text-transform:uppercase; }
    .footer { padding:24px 40px; border-top:1px solid rgba(201,150,58,0.15); text-align:center; }
    .footer p { margin:0; font-size:11px; color:#555; text-transform:uppercase; letter-spacing:.1em; }
    .footer a { color:#C9963A; text-decoration:none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🏠 New Booking Request</h1>
      <p>Milehigh5280 · Rehoboth Properties</p>
    </div>
    <div class="body">
      <div class="total-box">
        <div class="label">Total Booking Value</div>
        <div class="amount">${d.total}</div>
        <div class="label">${d.nights} night${d.nights !== 1 ? 's' : ''} · ${d.guests} guest${d.guests !== 1 ? 's' : ''} · ${d.currency}</div>
      </div>

      <div class="grid">
        <div class="field"><div class="lbl">Guest Name</div><div class="val">${d.firstName} ${d.lastName}</div></div>
        <div class="field"><div class="lbl">Property</div><div class="val">${d.propertyName}</div></div>
        <div class="field"><div class="lbl">Check-In</div><div class="val">${d.checkIn}</div></div>
        <div class="field"><div class="lbl">Check-Out</div><div class="val">${d.checkOut}</div></div>
        <div class="field"><div class="lbl">Email</div><div class="val"><a href="mailto:${d.email}" style="color:#C9963A;">${d.email}</a></div></div>
        <div class="field"><div class="lbl">Phone / WhatsApp</div><div class="val"><a href="tel:${d.phone}" style="color:#C9963A;">${d.phone}</a></div></div>
        <div class="field"><div class="lbl">Nationality</div><div class="val">${d.nationality || '—'}</div></div>
        <div class="field"><div class="lbl">Currency</div><div class="val">${d.currency}</div></div>
      </div>

      ${d.specialRequests ? `
      <div class="field" style="margin-bottom:24px;">
        <div class="lbl">Special Requests</div>
        <div class="val" style="margin-top:6px;color:#ccc;font-size:13px;line-height:1.7;">${d.specialRequests}</div>
      </div>` : ''}

      <a class="cta" href="mailto:${d.email}?subject=Your Booking Confirmation — ${d.propertyName}">
        Email Guest
      </a>
      &nbsp;&nbsp;
      <a class="cta" href="https://wa.me/${d.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(d.firstName)}%2C%20thank%20you%20for%20your%20booking%20at%20${encodeURIComponent(d.propertyName)}"
         style="background:linear-gradient(135deg,#25D366,#20BA5A);">
        WhatsApp Guest
      </a>
    </div>
    <div class="footer">
      <p>Received via <a href="https://milehigh5280.com">milehigh5280.com</a> · ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Accra' })} GMT</p>
    </div>
  </div>
</body>
</html>`;
}

function guestBookingHtml(d: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <style>
    body { margin:0; padding:0; background:#080808; font-family:'Helvetica Neue',Arial,sans-serif; color:#F5F0E8; }
    .wrapper { max-width:600px; margin:0 auto; background:#111111; border:1px solid rgba(201,150,58,0.2); }
    .header { background:linear-gradient(135deg,#C9963A,#E4B429,#C9963A); padding:32px 40px; }
    .header h1 { margin:0; color:#080808; font-size:22px; font-weight:700; }
    .header p { margin:6px 0 0; color:#080808; opacity:0.7; font-size:13px; text-transform:uppercase; letter-spacing:.1em; }
    .body { padding:40px; }
    .body p { font-size:15px; color:#ccc; line-height:1.8; margin:0 0 16px; }
    .summary { background:#1a1a1a; border:1px solid rgba(201,150,58,0.2); padding:24px; margin:24px 0; }
    .summary .row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(201,150,58,0.1); font-size:13px; }
    .summary .row:last-child { border-bottom:none; font-size:15px; color:#C9963A; font-weight:600; padding-top:14px; }
    .summary .row .key { color:#888; }
    .summary .row .val { color:#F5F0E8; }
    .wa-btn { display:inline-block; background:#25D366; color:#fff; padding:12px 28px; font-size:13px; font-weight:700; text-decoration:none; letter-spacing:.1em; text-transform:uppercase; margin-top:8px; }
    .footer { padding:24px 40px; border-top:1px solid rgba(201,150,58,0.15); text-align:center; }
    .footer p { margin:0; font-size:11px; color:#555; text-transform:uppercase; letter-spacing:.1em; }
    .footer a { color:#C9963A; text-decoration:none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🌴 Booking Received, ${d.firstName}!</h1>
      <p>Milehigh5280 · Rehoboth Properties</p>
    </div>
    <div class="body">
      <p>Thank you for choosing Milehigh5280! We have received your booking request and our team will confirm your reservation and reach out within <strong style="color:#C9963A;">2 hours</strong>.</p>

      <div class="summary">
        <div class="row"><span class="key">Property</span><span class="val">${d.propertyName}</span></div>
        <div class="row"><span class="key">Check-In</span><span class="val">${d.checkIn}</span></div>
        <div class="row"><span class="key">Check-Out</span><span class="val">${d.checkOut}</span></div>
        <div class="row"><span class="key">Nights</span><span class="val">${d.nights}</span></div>
        <div class="row"><span class="key">Guests</span><span class="val">${d.guests}</span></div>
        <div class="row"><span class="key">Total</span><span class="val" style="color:#C9963A;">${d.total}</span></div>
      </div>

      <p>For any immediate questions, message us directly on WhatsApp:</p>
      <a class="wa-btn" href="https://wa.me/233541988383?text=Hello%2C%20I%20just%20submitted%20a%20booking%20for%20${encodeURIComponent(d.propertyName)}">
        Chat on WhatsApp
      </a>
    </div>
    <div class="footer">
      <p>Milehigh5280 🌴 · <a href="https://milehigh5280.com">milehigh5280.com</a></p>
      <p style="margin-top:4px;">Rehoboth Properties · Ayi Mensah, Accra, Ghana</p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const body: BookingEmailData = await req.json();

    if (!body.email || !body.firstName || !body.propertyName) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.error('Gmail SMTP not configured.');
      return NextResponse.json({ error: 'Email service not configured.' }, { status: 503 });
    }

    const transporter = createTransporter();

    // 1️⃣ Admin notification
    await transporter.sendMail({
      from:    `"Milehigh5280 Bookings" <${process.env.GMAIL_USER}>`,
      to:      ADMIN_EMAIL,
      replyTo: body.email,
      subject: `🏠 New Booking: ${body.propertyName} — ${body.firstName} ${body.lastName} · ${body.checkIn}`,
      html:    adminBookingHtml(body),
      text:    `New booking from ${body.firstName} ${body.lastName} (${body.email})\nProperty: ${body.propertyName}\nDates: ${body.checkIn} → ${body.checkOut}\nGuests: ${body.guests} · Nights: ${body.nights}\nTotal: ${body.total}\nPhone: ${body.phone}`,
    });

    // 2️⃣ Guest confirmation
    await transporter.sendMail({
      from:    `"Milehigh5280 🌴" <${process.env.GMAIL_USER}>`,
      to:      body.email,
      subject: `Your booking request is confirmed — ${body.propertyName}`,
      html:    guestBookingHtml(body),
      text:    `Hi ${body.firstName},\n\nYour booking request for ${body.propertyName} has been received.\nDates: ${body.checkIn} – ${body.checkOut} (${body.nights} nights)\nTotal: ${body.total}\n\nWe will confirm within 2 hours. WhatsApp: +233 54 198 8383`,
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err: unknown) {
    console.error('Booking email error:', err);
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
}
