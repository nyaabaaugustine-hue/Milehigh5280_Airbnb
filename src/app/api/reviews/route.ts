import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'herbertprempeh@gmail.com';

function reviewHtml(data: Record<string, unknown>): string {
  const rating = data.rating as number;
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <style>
    body { margin:0; padding:0; background:#080808; font-family:'Helvetica Neue',Arial,sans-serif; color:#F5F0E8; }
    .wrapper { max-width:600px; margin:0 auto; background:#111111; border:1px solid rgba(201,150,58,0.2); }
    .header { background:linear-gradient(135deg,#C9963A,#E4B429,#C9963A); padding:24px 40px; }
    .header h1 { margin:0; color:#080808; font-size:18px; font-weight:700; }
    .body { padding:40px; }
    .stars { font-size:24px; color:#C9963A; margin-bottom:16px; }
    .meta { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; }
    .field { background:#1a1a1a; padding:14px 16px; border-left:2px solid #C9963A; }
    .field .lbl { font-size:10px; text-transform:uppercase; letter-spacing:.2em; color:#888; margin-bottom:4px; }
    .field .val { font-size:14px; color:#F5F0E8; }
    .comment { background:#1a1a1a; padding:20px; border-left:3px solid #C9963A; font-style:italic; color:#ccc; line-height:1.7; }
    .aspects { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:20px; }
    .aspect { display:flex; justify-content:space-between; background:#1a1a1a; padding:10px 14px; font-size:12px; }
    .footer { padding:24px 40px; border-top:1px solid rgba(201,150,58,0.15); text-align:center; }
    .footer p { margin:0; font-size:11px; color:#555; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>⭐ New Guest Review — Milehigh5280</h1>
    </div>
    <div class="body">
      <div class="stars">${stars}</div>
      <div class="meta">
        <div class="field"><div class="lbl">Guest Name</div><div class="val">${data.author}</div></div>
        <div class="field"><div class="lbl">Country</div><div class="val">${data.country || '—'}</div></div>
        <div class="field"><div class="lbl">Property</div><div class="val">${data.propertyName}</div></div>
        <div class="field"><div class="lbl">Stay Duration</div><div class="val">${data.stayDuration || 'Not specified'}</div></div>
      </div>
      <div class="comment">"${data.comment}"</div>
      <div class="footer">
        <p>Received via milehigh5280.com · ${new Date().toLocaleString('en-GB')}</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.author || !body.email || !body.rating || !body.comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.log('Review notification (email not configured):', body);
      return NextResponse.json({ success: true, note: 'Email not configured' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Milehigh5280 🌴" <${process.env.GMAIL_USER}>`,
      to: ADMIN_EMAIL,
      replyTo: body.email,
      subject: `⭐ New Review: ${body.author} — ${body.rating}/5`,
      html: reviewHtml(body),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Review submission error:', err);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
