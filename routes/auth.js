import express from "express"
import signUp from "../controller/signup.js"
const router = express.Router()

router.post('/signup', signUp)

export default router