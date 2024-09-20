import express from "express"
import dotenv from "dotenv"
import api from "./routes/api.js"
import connectDB from "./config/db.js"
import cors from "cors"
import { hppMiddleware, loggerMiddleware } from "./middleware/securityMiddlewares.js"
dotenv.config()

const app = express()
connectDB()
app.use(hppMiddleware) // For http Parameter pollution attack
app.use(loggerMiddleware) // for logs in file
app.use(cors());  // Enable CORS for all routes
app.use(express.json({ limit: '10kb' }))
app.use('/api', api)
app.get('/health', (req, res) => {
    res.status(200).send({ success: "Health is ok" })
})

app.listen(
    process.env.PORT, () => { console.log("Server is running") }
) 