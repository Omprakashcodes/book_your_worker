const nodemailer = require("nodemailer");

const createTransporter = () => {
    const requiredSettings = [
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_USER",
        "SMTP_PASS",
        "MAIL_FROM",
    ];

    const missingSetting = requiredSettings.find((setting) => !process.env[setting]);
    if (missingSetting) {
        throw new Error(`Email service is not configured. Missing ${missingSetting}`);
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

const sendPasswordResetEmail = async ({ to, resetUrl }) => {
    const transporter = createTransporter();

    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject: "Reset your Servigo password",
        text: `Reset your password using this link: ${resetUrl}\n\nThis link expires in 15 minutes. If you did not request this, you can ignore this email.`,
        html: `
            <div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033">
                <h2>Reset your Servigo password</h2>
                <p>Click the button below to choose a new password. This link expires in 15 minutes.</p>
                <p><a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:8px">Reset password</a></p>
                <p>If you did not request this, you can ignore this email.</p>
            </div>
        `,
    });
};

module.exports = { sendPasswordResetEmail };