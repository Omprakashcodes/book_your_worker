const nodemailer = require("nodemailer");

const createPasswordResetEmail = ({ resetUrl }) => ({
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

const parseSender = (value) => {
    const match = value.match(/^(.*)<([^<>]+)>$/);
    if (!match) {
        return { email: value.trim() };
    }

    return {
        name: match[1].trim().replace(/^\"|\"$/g, ""),
        email: match[2].trim(),
    };
};

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
    const email = createPasswordResetEmail({ resetUrl });

    if (process.env.BREVO_API_KEY) {
        if (!process.env.MAIL_FROM) {
            throw new Error("Email service is not configured. Missing MAIL_FROM");
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        let response;

        try {
            response = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    sender: parseSender(process.env.MAIL_FROM),
                    to: [{ email: to }],
                    subject: email.subject,
                    textContent: email.text,
                    htmlContent: email.html,
                }),
                signal: controller.signal,
            });
        } catch (error) {
            if (error.name === "AbortError") {
                throw new Error("Email provider timed out. Check the Brevo service and try again.");
            }
            throw error;
        } finally {
            clearTimeout(timeout);
        }

        if (!response.ok) {
            const details = await response.json().catch(() => ({}));
            throw new Error(details.message || `Email provider rejected the request (${response.status})`);
        }

        return;
    }

    const transporter = createTransporter();

    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject: email.subject,
        text: email.text,
        html: email.html,
    });
};

module.exports = { sendPasswordResetEmail };