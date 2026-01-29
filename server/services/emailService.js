const nodemailer = require("nodemailer");
const path = require("path");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

// Logo Configuration
const logoAttachment = {
  filename: 'logo.png',
  path: path.join(__dirname, '../assets/logo.png'),
  cid: 'rbt_logo' // Content ID unik untuk referensi di HTML
};

const getFromAddress = () => {
  return `"RBT_RACING Official" <${process.env.EMAIL_USER}>`;
};

// 1. Verification Email
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const htmlContent = `
    <div style="font-family: 'Helvetica', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee;">
      <div style="background-color: #000; padding: 30px; text-align: center;">
        <img src="cid:rbt_logo" alt="RBT_RACING" style="height: 100px; width: auto;" />
      </div>
      <div style="padding: 40px; color: #1a1a1a;">
        <h2 style="text-transform: uppercase; font-weight: 900; letter-spacing: -1px; margin-bottom: 20px;">Identity Verification</h2>
        <p style="line-height: 1.6; color: #666;">Welcome to the RBT_RACING ecosystem. To activate your account and enable checkout features, please verify your email address by clicking the button below.</p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${verificationUrl}" style="background-color: #000; color: #fff; padding: 18px 40px; text-decoration: none; font-weight: bold; border-radius: 2px; font-size: 12px; letter-spacing: 2px; display: inline-block;">VERIFY ACCOUNT</a>
        </div>
        <p style="font-size: 11px; color: #999; text-align: center; border-top: 1px solid #eee; pt: 20px;">This link expires in 10 minutes.</p>
      </div>
      <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 9px; color: #bbb; text-transform: uppercase; letter-spacing: 1px;">
        &copy; ${new Date().getFullYear()} RBT Racing Engineering. Managed Performance.
      </div>
    </div>
  `;

  return transporter.sendMail({
    from: getFromAddress(),
    to: email,
    subject: "Account Activation - RBT_RACING",
    html: htmlContent,
    attachments: [logoAttachment]
  });
};

// 2. Reset Password Email
const sendResetPasswordEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const htmlContent = `
    <div style="font-family: 'Helvetica', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee;">
      <div style="background-color: #000; padding: 30px; text-align: center;">
        <img src="cid:rbt_logo" alt="RBT_RACING" style="height: 100px; width: auto;" />
      </div>
      <div style="padding: 40px; color: #1a1a1a;">
        <h2 style="text-transform: uppercase; font-weight: 900; letter-spacing: -1px; margin-bottom: 20px; color: #d32f2f;">Security Alert: Reset Password</h2>
        <p style="line-height: 1.6; color: #666;">We received a request to reset your RBT_RACING account password. Click the button below to establish a new credential:</p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 18px 40px; text-decoration: none; font-weight: bold; border-radius: 2px; font-size: 12px; letter-spacing: 2px; display: inline-block;">RESET CREDENTIALS</a>
        </div>
        <p style="font-size: 11px; color: #999; text-align: center;">If you did not request this, please ignore this email or secure your account.</p>
      </div>
      <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 9px; color: #bbb; text-transform: uppercase; letter-spacing: 1px;">
        &copy; ${new Date().getFullYear()} RBT Racing Engineering. All Rights Reserved.
      </div>
    </div>
  `;

  return transporter.sendMail({
    from: getFromAddress(),
    to: email,
    subject: "Security: Reset Password Requested - RBT_RACING",
    html: htmlContent,
    attachments: [logoAttachment]
  });
};

module.exports = { sendVerificationEmail, sendResetPasswordEmail };