import express from "express"
import cors from "cors"
import { authRouter } from "./src/routes/auth.js"
import { messageRouter } from "./src/routes/message.js"


export const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/messages", messageRouter)

