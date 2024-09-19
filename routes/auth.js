import express from "express"
import signUp from "../controller/signup.js"
import signin from "../controller/signin.js"
const router = express.Router()

router.post('/signup', signUp)
router.post('/signin', signin)

export default router