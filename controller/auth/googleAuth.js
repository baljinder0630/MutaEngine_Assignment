import axios from "axios";
import User from "../../models/user.js";
import jwt from "jsonwebtoken"

const accessTokenCookieOptions = {
    // maxAge: 15000, // 15s local testing
    maxAge: 3600000, // 1hr
    httpOnly: false,
    domain: process.env.COOKIE_DOMAIN,
    path: '/',
    sameSite: 'lax',
    secure: false,
}

const refreshTokenCookieOptions = {
    ...accessTokenCookieOptions,
    maxAge: 86400000, // 1 day
}

const googleAuth = async (req, res) => {
    try {
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(process.env.CLIENT_ID)}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=profile email`;
        return res.redirect(url);
    } catch (error) {
        console.error('Error during Google authentication redirect:', error);
        res.json({ success: false, message: "Something went wrong" });
    }
}

const googleAuthCallback = async (req, res) => {
    const code = req.query.code;

    if (!code) {
        console.error('Authorization code is missing');
        return res.redirect('/login');
    }

    try {

        const { data } = await axios.post('https://oauth2.googleapis.com/token', new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: code,
            redirect_uri: process.env.REDIRECT_URI,
            grant_type: 'authorization_code',
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });


        const { access_token, id_token } = data;


        const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
        });


        const { email, given_name: firstName, family_name: lastName } = profile; // Use appropriate property names
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                firstName,
                lastName,
                emailVerified: true // Ensure consistent casing
            });
        }

        const accessToken = jwt.sign(
            { email: user.email, userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '1d',
            }
        )

        const refreshToken = jwt.sign(
            { email: user.email, userId: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: '7d',
            }
        )


        // set cookies
        res.cookie('accessToken', accessToken, accessTokenCookieOptions)
        res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
        res.redirect(process.env.client)

    } catch (error) {
        console.error('Error during OAuth callback:', error.response?.data?.error || error.message);
        res.redirect('/login');
    }
}

export { googleAuth, googleAuthCallback };
