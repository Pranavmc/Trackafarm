const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('[SMTP ERROR] Transporter configuration invalid. OTPs will not be sent to Gmail. Please check your EMAIL_USER and EMAIL_PASS in .env.');
  } else {
    console.log('[SMTP SUCCESS] Ready to send OTPs via Gmail.');
  }
});

const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"TrackaFarm Security" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your TrackaFarm Verification Code',
    html: `
      <div style="font-family: 'Outfit', sans-serif; background: #020617; color: #f8fafc; padding: 40px; border-radius: 24px; max-width: 500px; margin: auto; border: 1px solid rgba(255,255,255,0.1);">
        <h1 style="color: #00ff88; text-align: center; font-size: 28px; font-weight: 900;">Security Verification</h1>
        <p style="text-align: center; font-size: 16px; color: rgba(248, 250, 252, 0.7);">Use the following 6-digit code to verify your account:</p>
        <div style="background: rgba(255, 255, 255, 0.05); padding: 30px; border-radius: 20px; text-align: center; margin: 30px 0; border: 1px solid rgba(255,255,255,0.08);">
          <span style="font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #ffffff;">${otp}</span>
        </div>
        <p style="text-align: center; font-size: 14px; color: rgba(248, 250, 252, 0.5);">This code expires in 10 minutes. If you didn't request this, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 30px 0;">
        <p style="text-align: center; font-size: 12px; color: #00ff88; font-weight: 700; letter-spacing: 1px;">TRACKAFARM • THE FUTURE OF DAIRY</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] OTP sent to ${to}`);
    return true;
  } catch (error) {
    console.error('[EMAIL ERROR]', error);
    return false;
  }
};

module.exports = { sendOtpEmail };
