import cryptoRandomString from "crypto-random-string";
import User from "../../models/user.js";
import { sendEmail } from "../../services/sendEmail.js";

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    // email validation
    const randomString = cryptoRandomString({ length: 128, type: 'url-safe' })
    try {
        if (!email) return res.status(404).json({ success: false, message: "Invalid email" })

        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ success: false, message: "User not found" })

        const userId = user._id
        const url = `${process.env.CLIENT}/reset-password/?token=${randomString}&id=${userId}` //real link
        const html = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <title>Reset Your Password</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                            color: #333;
                        }
                        .email-container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            color: #333;
                        }
                        p {
                            font-size: 16px;
                            line-height: 1.5;
                        }
                        .reset-button {
                            display: inline-block;
                            padding: 10px 20px;
                            font-size: 16px;
                            color: #fff;
                            background-color: #007bff;
                            text-decoration: none;
                            border-radius: 4px;
                        }
                        .reset-button:hover {
                            background-color: #0056b3;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <h1>Reset Your Password</h1>
                        <p>Hello,</p>
                        <p>We received a request to reset your password. You can reset it by clicking the button below:</p>
                        <p><a href="${url}" class="reset-button">Reset Password</a></p>
                        <p>If you did not request a password reset, you can safely ignore this email.</p>
                        <p>Thanks,<br>Your Company Name</p>
                    </div>
                </body>
            </html>
        `;

        user.hash = randomString
        await user.save()
        sendEmail(email, "Reset your password", html)

        res.status(200).json({
            success: true,
            message: "Email sent for resetting password"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export default forgotPassword