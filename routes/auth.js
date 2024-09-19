import express from "express"
import signUp from "../controller/signup.js"
import signin from "../controller/signin.js"
import verifyEmail from "../controller/verifyEmail.js"
import sendForgotPass from "../controller/sendForgotPassword.js"
import resetPassword from "../controller/resetPassword.js"
import { googleAuth, googleAuthCallback } from "../controller/googleAuth.js"
const router = express.Router()

router.post('/signup', signUp)
router.post('/signin', signin)
router.post('/verifyemail', verifyEmail)
router.post('/forgotpassword', sendForgotPass)
router.post('/resetpassword', resetPassword)
router.get('/auth/google', googleAuth)
router.get('/auth/oauth2callback', googleAuthCallback)

export default router