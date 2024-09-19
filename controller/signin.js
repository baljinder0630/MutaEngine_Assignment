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