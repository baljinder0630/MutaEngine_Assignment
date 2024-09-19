import express from "express"
import signUp from "../controller/signup.js"
import signin from "../controller/signin.js"
import verifyEmail from "../controller/verifyEmail.js"
const router = express.Router()

router.post('/signup', signUp)
router.post('/signin', signin)
router.post('/verifyemail', verifyEmail)

export default router