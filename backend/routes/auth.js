import express from "express"
import signUp from "../controller/signup.js"
import signin from "../controller/signin.js"
import verifyEmail from "../controller/verifyEmail.js"
import sendForgotPass from "../controller/sendForgotPassword.js"
import resetPassword from "../controller/resetPassword.js"
import { googleAuth, googleAuthCallback } from "../controller/googleAuth.js"
import recaptchaVerification from "../middleware/recaptchaVerification.js"
const router = express.Router()

router.post('/signup', recaptchaVerification, signUp)
router.post('/signin', recaptchaVerification, signin)
router.post('/verifyemail', verifyEmail)
router.post('/forgotpassword', recaptchaVerification, sendForgotPass)
router.post('/resetpassword', resetPassword)
router.get('/auth/google', googleAuth)
router.get('/auth/oauth2callback', googleAuthCallback)

export default router