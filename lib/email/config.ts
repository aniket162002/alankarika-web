import nodemailer from 'nodemailer';

export const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

export const transporter = nodemailer.createTransport(emailConfig);

// Verify connection configuration
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    return false;
  }
};

export const adminEmail = process.env.ADMIN_EMAIL || 'akrutiutekar@gmail.com';
export const companyName = 'अलंकारिका';
export const companyEmail = process.env.COMPANY_EMAIL || 'akrutiutekar@gmail.com';
