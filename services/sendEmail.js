import nodemailer from "nodemailer"
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
const sendEmail = async (toAddress, subject, html) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: toAddress,
            subject: subject,
            html: html
        }

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent resp : " + info.response);
    } catch (error) {
        console.error(error.message);
    }
}

const sendInvoiceEmail = async (toEmail, invoicePath) => {


    const mailOptions = {
        from: process.env.SMTP_USER,
        to: toEmail,
        subject: 'Your Invoice',
        text: 'Thank you for your payment! Please find your invoice attached.',
        attachments: [
            {
                filename: 'invoice.pdf',
                path: invoicePath,
            },
        ],
    };

    await transporter.sendMail(mailOptions);
};

export { sendEmail, sendInvoiceEmail }