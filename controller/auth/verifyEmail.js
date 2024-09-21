import User from "../../models/user.js"
import jwt from "jsonwebtoken"

const accessTokenCookieOptions = {
    // maxAge: 15000, // 15s local testing
    maxAge: 3600000, // 1hr
    httpOnly: false,
    domain: process.env.COOKIE_DOMAIN,
    path: '/',
    sameSite: 'lax',
    secure: true,
}

const refreshTokenCookieOptions = {
    ...accessTokenCookieOptions,
    maxAge: 86400000, // 1 day
}

const verifyEmail = async (req, res) => {
    const hash = req.query.token
    // hash validation
    if (!hash) return res.status(400).json({ success: false, message: "Invalid Hash" })
    try {
        console.log(hash)
        const user = await User.findOne({ hash })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found!',
            })
        }
        user.hash = undefined
        user.emailVerified = true

        const { email } = user;
        const { userId } = user._id;

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

        user.refreshToken = [refreshToken];
        await user.save();

        res.cookie('accessToken', accessToken, accessTokenCookieOptions)
        res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            email: email
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export default verifyEmail