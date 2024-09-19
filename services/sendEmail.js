import nodemailer from "nodemailer"
const sendEmail = async (toAddress, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
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

export default sendEmail