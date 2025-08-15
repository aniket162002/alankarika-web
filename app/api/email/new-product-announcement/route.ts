import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { product } = await req.json();
    // Fetch all registered users
    const { data: users, error } = await supabase.from('users').select('email');
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    const emails = users?.map((u: any) => u.email).filter(Boolean);
    if (!emails || emails.length === 0) return NextResponse.json({ success: false, error: 'No users found' }, { status: 404 });

    // Email template
    const mailOptions = {
      from: `Alankarika Creations <alankarikaa@gmail.com>`,
      to: emails,
      subject: `New Product: ${product.name} Now Available!`,
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;background:linear-gradient(135deg,#fff7e6 0%,#ffe0b2 100%);padding:32px;border-radius:16px;max-width:600px;margin:auto;box-shadow:0 4px 24px #e0a96d33;">
          <div style='text-align:center;'>
            <img src='https://alankarika.com/alankarika-logo.png' alt='Alankarika Creations' style='height:64px;margin-bottom:18px;border-radius:12px;box-shadow:0 2px 8px #e0a96d33;' />
            <h1 style='color:#d97706;font-size:2rem;margin-bottom:8px;font-family:inherit;'>Alankarika Creations</h1>
            <span style='display:inline-block;background:#fff3cd;color:#d97706;padding:4px 16px;border-radius:8px;font-weight:600;font-size:1rem;margin-bottom:18px;'>Jewelry & Artistry</span>
          </div>
          <h2 style='color:#d97706;text-align:center;'>Introducing: <span style='color:#e67e22;'>${product.name}</span></h2>
          <img src='${product.image_url}' alt='${product.name}' style='width:100%;max-width:340px;border-radius:12px;margin:24px auto;display:block;box-shadow:0 2px 8px #e0a96d33;' />
          <p style='font-size:18px;color:#333;text-align:center;margin-bottom:16px;'>${product.short_description || product.description || ''}</p>
          <div style='text-align:center;'>
            <a href='https://alankarika.com/shop' style='display:inline-block;margin-top:18px;padding:14px 36px;background:linear-gradient(90deg,#e67e22 0%,#d97706 100%);color:#fff;font-weight:bold;border-radius:8px;text-decoration:none;font-size:1.1rem;box-shadow:0 2px 8px #e0a96d33;'>Shop Now</a>
          </div>
          <hr style='margin:32px 0;border:none;border-top:1px solid #f5c16c;' />
          <div style='text-align:center;'>
            <p style='font-size:14px;color:#888;margin-bottom:4px;'>You are receiving this email because you are a registered user of Alankarika Creations.</p>
            <p style='font-size:13px;color:#b8860b;margin-bottom:0;'>© ${new Date().getFullYear()} Alankarika Creations. All rights reserved.</p>
            <p style='font-size:12px;color:#e0a96d;margin-top:8px;'>Powered by <span style='color:#d97706;font-weight:bold;'>Akrix Solutions</span></p>
          </div>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
