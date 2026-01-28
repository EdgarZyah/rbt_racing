const nodemailer = require("nodemailer");

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

const getFromAddress = () => {
  return `"RBT_RACING Official" <${process.env.EMAIL_USER}>`;
};

// 1. Email ke Customer: Konfirmasi Pesanan Baru (Status: PENDING)
const sendOrderConfirmationEmail = async (order, userEmail) => {
  const htmlContent = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #000; color: #fff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-style: italic; text-transform: uppercase; letter-spacing: 2px;">RBT_RACING</h1>
      </div>
      <div style="padding: 30px;">
        <h2 style="text-transform: uppercase; font-weight: 900;">Order Confirmed</h2>
        <p>Pesanan Anda <strong>#${order.id}</strong> telah diterima dan sedang menunggu pembayaran.</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; font-size: 12px; font-weight: bold; color: #888;">TOTAL TAGIHAN:</p>
          <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: 900; color: #000;">Rp ${order.totalAmount.toLocaleString('id-ID')}</p>
        </div>
        <p style="font-size: 13px; line-height: 1.6;">Silakan lakukan pembayaran dan unggah bukti bayar melalui dashboard Anda.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/customer/orders" style="background-color: #000; color: #fff; padding: 12px 30px; text-decoration: none; font-weight: bold; display: inline-block;">LIHAT DETAIL PESANAN</a>
        </div>
      </div>
      <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 11px; color: #aaa;">
        &copy; ${new Date().getFullYear()} RBT_RACING Team.
      </div>
    </div>
  `;

  return transporter.sendMail({
    from: getFromAddress(),
    to: userEmail,
    subject: `Konfirmasi Pesanan #${order.id} - RBT_RACING`,
    html: htmlContent,
  });
};

// 2. Email ke Customer: Notifikasi Bukti Pembayaran Berhasil Diunggah
const sendPaymentUploadedCustomerNotification = async (order, userEmail) => {
  const htmlContent = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #000; color: #fff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-style: italic; text-transform: uppercase; letter-spacing: 2px;">RBT_RACING</h1>
      </div>
      <div style="padding: 30px;">
        <h2 style="text-transform: uppercase; font-weight: 900; color: #222;">Bukti Bayar Diterima</h2>
        <p>Halo, kami telah menerima unggahan bukti pembayaran Anda untuk pesanan <strong>#${order.id}</strong>.</p>
        <div style="background-color: #fff9e6; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; font-size: 12px; color: #92400e;"><strong>STATUS: SEDANG DIVERIFIKASI</strong></p>
          <p style="margin: 5px 0 0 0; font-size: 13px; color: #b45309;">Tim kami akan mengecek transaksi Anda dalam waktu maksimal 1x24 jam.</p>
        </div>
      </div>
      <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 11px; color: #aaa;">
        &copy; ${new Date().getFullYear()} RBT_RACING Team.
      </div>
    </div>
  `;

  return transporter.sendMail({
    from: getFromAddress(),
    to: userEmail,
    subject: `Bukti Bayar Pesanan #${order.id} Diterima - RBT_RACING`,
    html: htmlContent,
  });
};

// 3. Email ke Admin: Notifikasi untuk Verifikasi Pembayaran Customer
const sendAdminPaymentNotification = async (order, userName) => {
  const htmlContent = `
    <div style="font-family: sans-serif; padding: 20px; border: 2px solid #000;">
      <h2 style="background: #eab308; color: #000; padding: 10px; margin: 0;">URGENT: VERIFIKASI PEMBAYARAN</h2>
      <div style="padding: 20px; background: #fafafa;">
        <p>Admin, customer berikut telah mengunggah bukti pembayaran:</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Customer:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${userName}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Order ID:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">#${order.id}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Total:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">Rp ${order.totalAmount.toLocaleString('id-ID')}</td></tr>
        </table>
        <div style="margin-top: 25px; text-align: center;">
          <a href="${process.env.CLIENT_URL}/admin/orders" style="background: #000; color: #fff; padding: 12px 25px; text-decoration: none; font-weight: bold; font-size: 12px;">CEK BUKTI DI DASHBOARD</a>
        </div>
      </div>
    </div>
  `;

  return transporter.sendMail({
    from: getFromAddress(),
    to: process.env.ADMIN_EMAIL,
    subject: `[ACTION REQUIRED] Bukti Bayar Baru - Order #${order.id}`,
    html: htmlContent,
  });
};

module.exports = { 
  sendOrderConfirmationEmail, 
  sendPaymentUploadedCustomerNotification, 
  sendAdminPaymentNotification 
};