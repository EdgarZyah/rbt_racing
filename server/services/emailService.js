const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // Port 465 menggunakan SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Menghindari isu sertifikat self-signed pada beberapa cPanel
  }
});

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #000; color: #fff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-style: italic; text-transform: uppercase; letter-spacing: 2px;">RBT_RACING</h1>
      </div>
      <div style="padding: 40px 30px; color: #333;">
        <h2 style="text-transform: uppercase; font-weight: 900; margin-bottom: 20px;">Konfirmasi Identitas Anda</h2>
        <p style="line-height: 1.6;">Selamat datang di ekosistem RBT_RACING. Untuk mengaktifkan fitur checkout, silakan verifikasi alamat email Anda.</p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${verificationUrl}" style="background-color: #000; color: #fff; padding: 15px 35px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">VERIFIKASI AKUN</a>
        </div>
        <p style="font-size: 12px; color: #888; text-align: center;">Link ini akan kedaluwarsa dalam <strong>10 menit</strong>.</p>
      </div>
      <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 11px; color: #aaa; border-top: 1px solid #eee;">
        &copy; ${new Date().getFullYear()} RBT_RACING Team.
      </div>
    </div>
  `;

  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Aktivasi Akun RBT_RACING",
    html: htmlContent,
  });
};

module.exports = { sendVerificationEmail };