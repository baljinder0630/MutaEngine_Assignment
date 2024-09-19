import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import sendEmail from "../services/sendEmail.js"

const signin = async (req, res) => {
    const { email, password } = req.body
    try {
        // Add email validation
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        if (await bcrypt.compare(password, user.password)) {
            if (!user.emailVerified) {
                const html = `
                    <!DOCTYPE html>
                    <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <meta http-equiv="X-UA-Compatible" content="ie=edge">
                            <title>Verify your email</title>
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
                                .verify-button {
                                    display: inline-block;
                                    padding: 10px 20px;
                                    font-size: 16px;
                                    color: #fff;
                                    background-color: #28a745;
                                    text-decoration: none;
                                    border-radius: 4px;
                                }
                                .verify-button:hover {
                                    background-color: #218838;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="email-container">
                                <h1>Verify Your Email Address</h1>
                                <p>Hello,</p>
                                <p>Thank you for signing up! To complete your registration, please verify your email address by clicking the button below:</p>
                                <p><a href="your-verification-link" class="verify-button">Verify Email</a></p>
                                <p>If you did not create an account, you can safely ignore this email.</p>
                                <p>Thanks,<br>Your Company Name</p>
                            </div>
                        </body>
                    </html>
                `;
                sendEmail(email, "Verify Your Email", html);
                return res.status(404).json({ success: false, message: "Verify your email to proceed" })
            }
            const userId = user._id
            const accessToken = jwt.sign(
                { email, userId },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1d' }
            )
            const refreshToken = jwt.sign(
                { email, userId },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '7d' }
            )

            return res.status(200).json({
                success: true,
                message: "User signed in successfully",
                accessToken: accessToken,
                refreshToken: refreshToken,
                email: email
            })
        }

    } catch (error) {

    }
}

export default signin