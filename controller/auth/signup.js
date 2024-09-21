import User from "../../models/user.js"
import bcrypt from "bcrypt"
import { sendEmail } from "../../services/sendEmail.js"
import cryptoRandomString from 'crypto-random-string'
import axios from "axios"

const signUp = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    if (!email) return res.status(404).json({
        success: false,
        message: "Email is required"
    })

    if (!password) return res.status(404).json({
        success: false,
        message: "Password is required"
    })

    if (!firstName) return res.status(404).json({
        success: false,
        message: "FirstName is required"
    })

    try {
        const saltPassword = await bcrypt.genSalt(10)
        const hashPass = await bcrypt.hash(password, saltPassword)
        const randomString = cryptoRandomString({ length: 128, type: 'url-safe' })
        const randomString2 = cryptoRandomString({ length: 128, type: 'url-safe' })
        await User.create({
            email, password: hashPass, firstName, lastName, hash: randomString2
        })

        const url = `${process.env.CLIENT}/verifyemail/?token=${randomString2}`
        // TODO:
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
                        <p><a href="${url}" class="verify-button">Verify Email</a></p>
                        <p>If you did not create an account, you can safely ignore this email.</p>
                        <p>Thanks,<br>Your Company Name</p>
                    </div>
                </body>
            </html>
        `;


        sendEmail(email, "Verify Your Email", html);
        return res.status(200).json({
            success: true,
            message: "Email sent for verification"
        })
    } catch (error) {
        if (error.code && error.code === 11000) {
            if (error.keyPattern.hasOwnProperty('email')) {
                return res.status(400).json({
                    success: false,
                    message: "Email already exist"
                })
            }
        }
        else {
            console.error(error.message);
            return res.status(500).json({
                success: false,
                message: "Something went wrong"
            })
        }
    }
}

export default signUp