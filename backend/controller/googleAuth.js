import axios from "axios";

const googleAuth = async (req, res) => {
    try {
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(process.env.CLIENT_ID)}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=profile email`;
        res.redirect(url);
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
        console.log(code);

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
        console.log(data);

        const { access_token, id_token } = data;


        const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        res.redirect('/');
    } catch (error) {
        console.error('Error during OAuth callback:', error.response?.data?.error || error.message);
        res.redirect('/login');
    }
}

export { googleAuth, googleAuthCallback };
