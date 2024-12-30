import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.GMAIL_PASS,
  },
});

const sendMail = async (email, otp) => {
  const info = await transporter.sendMail({
    from: '"Multi Bill Scanner App Community" <no-reply@multibillscanner.com>',
    to: email,
    subject: "Verify Your Email - Multi Bill Scanner",
    text: `Your OTP is ${otp}.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; max-width: 600px; margin: auto;">
        <h2 style="color: #156082; text-align: center;">Welcome to Multi Bill Scanner!</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Thank you for joining the Multi Bill Scanner community! To complete your registration, please verify your email by using the One-Time Password (OTP) below:
        </p>

        <!-- OTP Section -->
        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; font-size: 28px; font-weight: bold; color: #fff; background-color: #156082; padding: 15px 30px; border-radius: 5px;">${otp}</span>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          <strong>Note:</strong> This OTP is valid for 10 minutes. If you did not request this email, you can safely ignore it.
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

        <!-- Footer Section -->
        <footer style="text-align: center; font-size: 14px; color: #aaa;">
          Multi Bill Scanner App Community<br>
          <span style="color: #156082;">Thank you for trusting us!</span>
        </footer>
      </div>
    `,
  });

  console.log(`OTP email sent: ${info.messageId}`);
};

export { sendMail };
