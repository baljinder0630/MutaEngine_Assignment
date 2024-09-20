import axios from "axios"

const recaptchaVerification = async (req, res, next) => {
    const { recaptchaToken } = req.body
    if (!recaptchaToken)
        return res.status(400).json({ success: false, message: "Recaptcha verification failed" })
    try {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: process.env.RECAPTCHA_SECRET,
                response: recaptchaToken
            }
        })
        const { success } = response.data
        if (!success) return res.status(400).json({ success: false, message: "Recaptcha Verification Failed" })
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

export default recaptchaVerification