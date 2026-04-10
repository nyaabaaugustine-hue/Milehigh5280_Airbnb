import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import type { BookingEmailData } from '@/types';
import { execute } from '@/lib/neon/client';

const ADMIN_EMAIL  = process.env.ADMIN_EMAIL ?? 'herbertprempeh@gmail.com';
const WA_NUMBER    = '233599754270';
const WA_DISPLAY   = '+233 059 975 4270';

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
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/>
<style>
body{margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Arial,sans-serif;color:#F5F0E8;}
.w{max-width:600px;margin:0 auto;background:#111111;border:1px solid rgba(201,150,58,0.2);}
.hd{background:linear-gradient(135deg,#C9963A,#E4B429,#C9963A);padding:32px 40px;}
.hd h1{margin:0;color:#080808;font-size:22px;font-weight:700;}
.hd p{margin:6px 0 0;color:#080808;opacity:.7;font-size:13px;text-transform:uppercase;letter-spacing:.1em;}
.bd{padding:40px;}
.tb{background:rgba(201,150,58,.1);border:1px solid rgba(201,150,58,.4);padding:20px 24px;text-align:center;margin-bottom:28px;}
.tb .a{font-size:36px;color:#C9963A;font-weight:300;font-family:Georgia,serif;}
.tb .l{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:.15em;}
.g{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;}
.f{background:#1a1a1a;padding:14px 16px;border-left:2px solid #C9963A;}
.f .lb{font-size:10px;text-transform:uppercase;letter-spacing:.2em;color:#888;margin-bottom:4px;}
.f .v{font-size:14px;color:#F5F0E8;}
.cta{display:inline-block;background:linear-gradient(135deg,#C9963A,#E4B429);color:#080808;padding:12px 28px;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:.1em;text-transform:uppercase;}
.ft{padding:24px 40px;border-top:1px solid rgba(201,150,58,.15);text-align:center;}
.ft p{margin:0;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:.1em;}
.ft a{color:#C9963A;text-decoration:none;}
</style></head><body>
<div class="w">
  <div class="hd"><h1>🏠 New Booking Request</h1><p>Milehigh5280 · Milehigh Properties</p></div>
  <div class="bd">
    <div class="tb">
      <div class="l">Total Booking Value</div>
      <div class="a">${d.total}</div>
      <div class="l">${d.nights} night${d.nights !== 1 ? 's' : ''} · ${d.guests} guest${d.guests !== 1 ? 's' : ''} · ${d.currency}</div>
    </div>
    <div class="g">
      <div class="f"><div class="lb">Guest Name</div><div class="v">${d.firstName} ${d.lastName}</div></div>
      <div class="f"><div class="lb">Property</div><div class="v">${d.propertyName}</div></div>
      <div class="f"><div class="lb">Check-In</div><div class="v">${d.checkIn}</div></div>
      <div class="f"><div class="lb">Check-Out</div><div class="v">${d.checkOut}</div></div>
      <div class="f"><div class="lb">Email</div><div class="v"><a href="mailto:${d.email}" style="color:#C9963A;">${d.email}</a></div></div>
      <div class="f"><div class="lb">Phone / WhatsApp</div><div class="v"><a href="tel:${d.phone}" style="color:#C9963A;">${d.phone}</a></div></div>
      <div class="f"><div class="lb">Nationality</div><div class="v">${d.nationality || '—'}</div></div>
      <div class="f"><div class="lb">Currency</div><div class="v">${d.currency}</div></div>
    </div>
    ${d.specialRequests ? `<div class="f" style="margin-bottom:24px;"><div class="lb">Special Requests</div><div class="v" style="margin-top:6px;color:#ccc;font-size:13px;line-height:1.7;">${d.specialRequests}</div></div>` : ''}
    <a class="cta" href="mailto:${d.email}?subject=Your Booking Confirmation — ${d.propertyName}">Email Guest</a>
    &nbsp;&nbsp;
    <a class="cta" href="https://wa.me/${d.phone.replace(/\D/g,'')}?text=Hello%20${encodeURIComponent(d.firstName)}%2C%20thank%20you%20for%20your%20booking%20at%20${encodeURIComponent(d.propertyName)}" style="background:linear-gradient(135deg,#25D366,#20BA5A);">WhatsApp Guest</a>
  </div>
  <div class="ft"><p>Received via <a href="https://milehigh5280.com">milehigh5280.com</a> · ${new Date().toLocaleString('en-GB',{timeZone:'Africa/Accra'})} GMT</p></div>
</div></body></html>`;
}

function guestBookingHtml(d: BookingEmailData): string {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/>
<style>
body{margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Arial,sans-serif;color:#F5F0E8;}
.w{max-width:600px;margin:0 auto;background:#111111;border:1px solid rgba(201,150,58,0.2);}
.hd{background:linear-gradient(135deg,#C9963A,#E4B429,#C9963A);padding:32px 40px;}
.hd h1{margin:0;color:#080808;font-size:22px;font-weight:700;}
.hd p{margin:6px 0 0;color:#080808;opacity:.7;font-size:13px;text-transform:uppercase;letter-spacing:.1em;}
.bd{padding:40px;}
.bd p{font-size:15px;color:#ccc;line-height:1.8;margin:0 0 16px;}
.s{background:#1a1a1a;border:1px solid rgba(201,150,58,0.2);padding:24px;margin:24px 0;}
.r{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(201,150,58,0.1);font-size:13px;}
.r:last-child{border-bottom:none;font-size:15px;color:#C9963A;font-weight:600;padding-top:14px;}
.k{color:#888;}.v{color:#F5F0E8;}
.wa{display:inline-block;background:#25D366;color:#fff;padding:12px 28px;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:.1em;text-transform:uppercase;margin-top:8px;}
.ft{padding:24px 40px;border-top:1px solid rgba(201,150,58,.15);text-align:center;}
.ft p{margin:0;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:.1em;}
.ft a{color:#C9963A;text-decoration:none;}
</style></head><body>
<div class="w">
  <div class="hd"><h1>🌴 Booking Received, ${d.firstName}!</h1><p>Milehigh5280 · Milehigh Properties</p></div>
  <div class="bd">
    <p>Thank you for choosing Milehigh5280! We have received your booking and our team will confirm within <strong style="color:#C9963A;">2 hours</strong>.</p>
    <div class="s">
      <div class="r"><span class="k">Property</span><span class="v">${d.propertyName}</span></div>
      <div class="r"><span class="k">Check-In</span><span class="v">${d.checkIn}</span></div>
      <div class="r"><span class="k">Check-Out</span><span class="v">${d.checkOut}</span></div>
      <div class="r"><span class="k">Nights</span><span class="v">${d.nights}</span></div>
      <div class="r"><span class="k">Guests</span><span class="v">${d.guests}</span></div>
      <div class="r"><span class="k">Total</span><span class="v" style="color:#C9963A;">${d.total}</span></div>
    </div>
    <p>For any immediate questions, message us on WhatsApp:</p>
    <a class="wa" href="https://wa.me/${WA_NUMBER}?text=Hello%2C%20I%20just%20submitted%20a%20booking%20for%20${encodeURIComponent(d.propertyName)}">Chat on WhatsApp</a>
  </div>
  <div class="ft">
    <p>Milehigh5280 🌴 · <a href="https://milehigh5280.com">milehigh5280.com</a></p>
    <p style="margin-top:4px;">Milehigh Properties · Ayi Mensah, Accra, Ghana · ${WA_DISPLAY}</p>
  </div>
</div></body></html>`;
}

export async function POST(req: NextRequest) {
  try {
    const body: BookingEmailData = await req.json();

    if (!body.email || !body.firstName || !body.propertyName) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // ── 1. Log booking to Neon DB (non-blocking) ─────────────
    try {
      await execute(
        `INSERT INTO bookings
           (first_name, last_name, email, phone, property_name,
            check_in, check_out, guests, nights, total_price,
            currency, special_requests, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'pending')`,
        [
          body.firstName,
          body.lastName   || '',
          body.email,
          body.phone      || '',
          body.propertyName,
          body.checkIn,
          body.checkOut,
          body.guests     ?? 1,
          body.nights     ?? null,
          body.total      || null,
          body.currency   || 'USD',
          body.specialRequests || null,
        ]
      );
      console.log(`[DB] Booking logged for ${body.email}`);
    } catch (dbErr) {
      console.error('[DB] Failed to log booking:', dbErr);
      // Non-fatal — continue with email
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.error('Gmail SMTP not configured.');
      return NextResponse.json({ error: 'Email service not configured.' }, { status: 503 });
    }

    // ── 2. Send emails ────────────────────────────────────────
    const transporter = createTransporter();

    await transporter.sendMail({
      from:    `"Milehigh5280 Bookings" <${process.env.GMAIL_USER}>`,
      to:      ADMIN_EMAIL,
      replyTo: body.email,
      subject: `🏠 New Booking: ${body.propertyName} — ${body.firstName} ${body.lastName} · ${body.checkIn}`,
      html:    adminBookingHtml(body),
      text:    `New booking from ${body.firstName} ${body.lastName} (${body.email})\nProperty: ${body.propertyName}\nDates: ${body.checkIn} → ${body.checkOut}\nGuests: ${body.guests} · Nights: ${body.nights}\nTotal: ${body.total}\nPhone: ${body.phone}`,
    });

    await transporter.sendMail({
      from:    `"Milehigh5280 🌴" <${process.env.GMAIL_USER}>`,
      to:      body.email,
      subject: `Your booking request is confirmed — ${body.propertyName}`,
      html:    guestBookingHtml(body),
      text:    `Hi ${body.firstName},\n\nYour booking for ${body.propertyName} has been received.\nDates: ${body.checkIn} – ${body.checkOut} (${body.nights} nights)\nTotal: ${body.total}\n\nWe will confirm within 2 hours. WhatsApp: ${WA_DISPLAY}`,
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err: unknown) {
    console.error('Booking email error:', err);
    return NextResponse.json({ error: 'Failed to send booking.' }, { status: 500 });
  }
}
