import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'herbertprempeh@gmail.com';

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
  });
}

const EMAIL_TEMPLATES = {
  bookingConfirmation: (data: Record<string, unknown>) => ({
    subject: `🌴 Booking Confirmed — ${data.propertyName}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <style>
    body { margin:0; padding:0; background:#080808; font-family:'Helvetica Neue',Arial,sans-serif; color:#F5F0E8; }
    .wrapper { max-width:600px; margin:0 auto; background:#111111; border:1px solid rgba(201,150,58,0.2); }
    .header { background:linear-gradient(135deg,#C9963A,#E4B429); padding:32px 40px; text-align:center; }
    .header h1 { margin:0; color:#080808; font-size:22px; font-weight:700; }
    .header p { margin:8px 0 0; color:#080808; opacity:0.7; font-size:13px; }
    .body { padding:40px; }
    .body p { font-size:15px; color:#ccc; line-height:1.8; margin:0 0 16px; }
    .summary { background:#1a1a1a; border:1px solid rgba(201,150,58,0.2); padding:24px; margin:24px 0; }
    .row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid rgba(201,150,58,0.1); font-size:13px; }
    .row:last-child { border-bottom:none; font-size:15px; color:#C9963A; font-weight:600; padding-top:14px; }
    .row .key { color:#888; }
    .row .val { color:#F5F0E8; }
    .cta { display:inline-block; background:linear-gradient(135deg,#C9963A,#E4B429); color:#080808; padding:12px 28px; font-size:13px; font-weight:700; text-decoration:none; border-radius:4px; }
    .footer { padding:24px 40px; border-top:1px solid rgba(201,150,58,0.15); text-align:center; }
    .footer p { margin:0; font-size:11px; color:#555; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🌴 Booking Confirmed!</h1>
      <p>Milehigh5280 · Milehigh Properties</p>
    </div>
    <div class="body">
      <p>Dear ${data.firstName},</p>
      <p>Your reservation has been confirmed! We are delighted to welcome you to <strong>${data.propertyName}</strong>.</p>
      <div class="summary">
        <div class="row"><span class="key">Property</span><span class="val">${data.propertyName}</span></div>
        <div class="row"><span class="key">Check-In</span><span class="val">${data.checkIn}</span></div>
        <div class="row"><span class="key">Check-Out</span><span class="val">${data.checkOut}</span></div>
        <div class="row"><span class="key">Guests</span><span class="val">${data.guests}</span></div>
        <div class="row"><span class="key">Total Paid</span><span class="val">${data.total}</span></div>
      </div>
      <p>Our concierge team will reach out 48 hours before your arrival with check-in instructions and any special arrangements.</p>
      <p style="text-align:center; margin-top:24px;">
        <a class="cta" href="https://wa.me/233599754270">Chat with Concierge</a>
      </p>
    </div>
    <div class="footer">
      <p>Milehigh5280 🌴 · Ayi Mensah, Accra, Ghana</p>
    </div>
  </div>
</body>
</html>`,
  }),

  reminder24h: (data: Record<string, unknown>) => ({
    subject: `⏰ Check-in Tomorrow — ${data.propertyName}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <style>
    body { margin:0; padding:0; background:#080808; font-family:'Helvetica Neue',Arial,sans-serif; color:#F5F0E8; }
    .wrapper { max-width:600px; margin:0 auto; background:#111111; border:1px solid rgba(201,150,58,0.2); }
    .header { background:linear-gradient(135deg,#C9963A,#E4B429); padding:32px 40px; text-align:center; }
    .header h1 { margin:0; color:#080808; font-size:22px; font-weight:700; }
    .body { padding:40px; }
    .body p { font-size:15px; color:#ccc; line-height:1.8; margin:0 0 16px; }
    .checklist { background:#1a1a1a; padding:24px; margin:24px 0; }
    .checklist h3 { color:#C9963A; font-size:14px; margin:0 0 16px; text-transform:uppercase; letter-spacing:.1em; }
    .checklist li { color:#ccc; font-size:13px; margin-bottom:10px; padding-left:8px; }
    .cta { display:inline-block; background:linear-gradient(135deg,#C9963A,#E4B429); color:#080808; padding:12px 28px; font-size:13px; font-weight:700; text-decoration:none; border-radius:4px; }
    .footer { padding:24px 40px; border-top:1px solid rgba(201,150,58,0.15); text-align:center; }
    .footer p { margin:0; font-size:11px; color:#555; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>⏰ Your Stay Begins Tomorrow!</h1>
    </div>
    <div class="body">
      <p>Dear ${data.firstName},</p>
      <p>We are excited to welcome you tomorrow! Here is everything you need to know for a smooth check-in:</p>
      <div class="checklist">
        <h3>Check-In Checklist</h3>
        <ul>
          <li>📍 Address: Ayi Mensah, Accra, Ghana (we will send exact directions 2 hours before)</li>
          <li>🕐 Check-in time: 2:00 PM</li>
          <li>🔑 Access code will be sent 1 hour before check-in</li>
          <li>📱 WhatsApp our concierge for any immediate needs</li>
          <li>🌡️ AC is pre-set to 22°C for your comfort</li>
        </ul>
      </div>
      <p>If you need anything before your arrival — early check-in, airport pickup, special arrangements — please let us know!</p>
      <p style="text-align:center; margin-top:24px;">
        <a class="cta" href="https://wa.me/233599754270">Contact Concierge</a>
      </p>
    </div>
    <div class="footer">
      <p>Milehigh5280 🌴 · Akwaaba — Welcome Home!</p>
    </div>
  </div>
</body>
</html>`,
  }),

  followUp: (data: Record<string, unknown>) => ({
    subject: `📝 How Was Your Stay? — ${data.propertyName}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <style>
    body { margin:0; padding:0; background:#080808; font-family:'Helvetica Neue',Arial,sans-serif; color:#F5F0E8; }
    .wrapper { max-width:600px; margin:0 auto; background:#111111; border:1px solid rgba(201,150,58,0.2); }
    .header { background:linear-gradient(135deg,#C9963A,#E4B429); padding:32px 40px; text-align:center; }
    .header h1 { margin:0; color:#080808; font-size:22px; font-weight:700; }
    .body { padding:40px; }
    .body p { font-size:15px; color:#ccc; line-height:1.8; margin:0 0 16px; }
    .review-cta { background:linear-gradient(135deg,rgba(201,150,58,0.1),rgba(201,150,58,0.05)); border:1px solid rgba(201,150,58,0.3); padding:28px; margin:24px 0; text-align:center; }
    .review-cta h3 { color:#C9963A; font-size:16px; margin:0 0 12px; }
    .review-cta p { font-size:13px; margin:0 0 16px; }
    .stars { font-size:28px; color:#C9963A; margin-bottom:16px; }
    .cta { display:inline-block; background:linear-gradient(135deg,#C9963A,#E4B429); color:#080808; padding:12px 28px; font-size:13px; font-weight:700; text-decoration:none; border-radius:4px; }
    .footer { padding:24px 40px; border-top:1px solid rgba(201,150,58,0.15); text-align:center; }
    .footer p { margin:0; font-size:11px; color:#555; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>📝 We Value Your Feedback</h1>
    </div>
    <div class="body">
      <p>Dear ${data.firstName},</p>
      <p>Thank you for staying at <strong>${data.propertyName}</strong>. We hope you had a wonderful experience!</p>
      <div class="review-cta">
        <div class="stars">★★★★★</div>
        <h3>Share Your Experience</h3>
        <p>Your review helps future guests and motivates our team to keep delivering excellence.</p>
        <a class="cta" href="${data.reviewLink}">Write a Review</a>
      </div>
      <p>We would love to welcome you back! Ask about our returning guest discounts.</p>
      <p style="margin-top:24px;">With warmth,<br/><strong style="color:#C9963A;">Milehigh Properties Team</strong></p>
    </div>
    <div class="footer">
      <p>Milehigh5280 🌴 · Ayi Mensah, Accra, Ghana</p>
    </div>
  </div>
</body>
</html>`,
  }),
};

export async function POST(req: NextRequest) {
  try {
    const { type, email, ...data } = await req.json();

    if (!type || !email) {
      return NextResponse.json({ error: 'Missing type or email' }, { status: 400 });
    }

    const template = EMAIL_TEMPLATES[type as keyof typeof EMAIL_TEMPLATES];
    if (!template) {
      return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.log(`Email notification (${type}) - not configured:`, { email, ...data });
      return NextResponse.json({ success: true, note: 'Email not configured' });
    }

    const transporter = createTransporter();
    const { subject, html } = template({ email, ...data });

    await transporter.sendMail({
      from: `"Milehigh5280 🌴" <${process.env.GMAIL_USER}>`,
      to: email,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Reminder email error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    available: ['bookingConfirmation', 'reminder24h', 'followUp'],
    usage: 'POST with { type, email, ...data }',
  });
}
