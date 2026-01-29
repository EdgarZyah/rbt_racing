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

const logoAttachment = {
  filename: 'logo.png',
  path: path.join(__dirname, '../assets/logo.png'),
  cid: 'rbt_logo'
};

const getFromAddress = () => {
  return `"RBT_RACING Official" <${process.env.EMAIL_USER}>`;
};

// 1. Order Confirmed (PENDING)
const sendOrderConfirmationEmail = async (order, userEmail) => {
  const htmlContent = `
    <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee;">
      <div style="background-color: #000; padding: 30px; text-align: center;">
        <img src="cid:rbt_logo" style="height: 100px; width: auto;" />
      </div>
      <div style="padding: 35px; color: #1a1a1a;">
        <h2 style="text-transform: uppercase; font-weight: 900; margin-bottom: 5px;">Order Confirmed</h2>
        <p style="font-size: 12px; color: #999; margin-bottom: 25px;">Order ID: #${order.id}</p>
        <p style="color: #666;">Your order has been logged into our system and is currently <strong>Awaiting Payment</strong>.</p>
        
        <div style="background-color: #f8f8f8; padding: 25px; margin: 30px 0; border-left: 4px solid #000;">
          <p style="margin: 0; font-size: 10px; font-weight: bold; color: #888; text-transform: uppercase; letter-spacing: 1px;">Outstanding Balance:</p>
          <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: 900; color: #000; font-style: italic;">Rp ${order.totalAmount.toLocaleString('id-ID')}</p>
        </div>

        <div style="text-align: center; margin: 35px 0;">
          <a href="${process.env.CLIENT_URL}/customer/orders" style="background-color: #000; color: #fff; padding: 15px 35px; text-decoration: none; font-weight: bold; font-size: 11px; letter-spacing: 1px; display: inline-block;">UPLOAD PAYMENT PROOF</a>
        </div>
      </div>
      <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 9px; color: #bbb;">
        &copy; ${new Date().getFullYear()} RBT Racing Engineering. Performance Delivered.
      </div>
    </div>
  `;

  return transporter.sendMail({
    from: getFromAddress(),
    to: userEmail,
    subject: `Order Confirmation #${order.id} - RBT_RACING`,
    html: htmlContent,
    attachments: [logoAttachment]
  });
};

// 2. Proof Received Notification
const sendPaymentUploadedCustomerNotification = async (order, userEmail) => {
  const htmlContent = `
    <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee;">
      <div style="background-color: #000; padding: 30px; text-align: center;">
        <img src="cid:rbt_logo" style="height: 100px; width: auto;" />
      </div>
      <div style="padding: 35px; color: #1a1a1a;">
        <h2 style="text-transform: uppercase; font-weight: 900;">Payment Transmitted</h2>
        <p style="color: #666;">We have successfully received your payment proof for order <strong>#${order.id}</strong>.</p>
        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0;">
          <p style="margin: 0; font-size: 11px; font-weight: 900; color: #92400e; text-transform: uppercase;">Status: Verification in Progress</p>
          <p style="margin: 5px 0 0 0; font-size: 13px; color: #b45309; line-height: 1.5;">Our finance department will validate your transaction within 24 hours.</p>
        </div>
      </div>
      <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 9px; color: #bbb;">
        &copy; ${new Date().getFullYear()} RBT Racing Engineering.
      </div>
    </div>
  `;

  return transporter.sendMail({
    from: getFromAddress(),
    to: userEmail,
    subject: `Payment Verification Initiated #${order.id} - RBT_RACING`,
    html: htmlContent,
    attachments: [logoAttachment]
  });
};

// 3. Admin Notification (Sederhana tapi tetap Profesional)
const sendAdminPaymentNotification = async (order, userName) => {
  const htmlContent = `
    <div style="font-family: sans-serif; padding: 30px; border: 5px solid #000;">
      <h2 style="background: #eab308; color: #000; padding: 15px; margin: 0; font-weight: 900; text-transform: uppercase; text-align: center;">Action Required: Payment Verification</h2>
      <div style="padding: 30px; background: #fff;">
        <p style="margin-bottom: 20px; font-weight: bold;">New payment proof has been uploaded by the customer:</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #888;">CUSTOMER NAME</td><td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">${userName}</td></tr>
          <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #888;">REFERENCE ID</td><td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">#${order.id}</td></tr>
          <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #888;">TOTAL PAYABLE</td><td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">Rp ${order.totalAmount.toLocaleString('id-ID')}</td></tr>
        </table>
        <div style="margin-top: 40px; text-align: center;">
          <a href="${process.env.CLIENT_URL}/admin/orders" style="background: #000; color: #fff; padding: 15px 40px; text-decoration: none; font-weight: bold; font-size: 11px; letter-spacing: 1px;">ACCESS CONTROL PANEL</a>
        </div>
      </div>
    </div>
  `;

  return transporter.sendMail({
    from: getFromAddress(),
    to: process.env.ADMIN_EMAIL,
    subject: `[INTERNAL] Verify Payment - Order #${order.id}`,
    html: htmlContent
  });
};

module.exports = { 
  sendOrderConfirmationEmail, 
  sendPaymentUploadedCustomerNotification, 
  sendAdminPaymentNotification 
};