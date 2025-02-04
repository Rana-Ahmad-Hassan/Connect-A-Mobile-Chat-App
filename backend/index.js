import dotenv from "dotenv"
import { connection } from "./src/config/db.js"
import { server } from "./src/socket/socket.js"



dotenv.config()

const PORT = process.env.PORT || 8000

connection()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    })
    .catch((error) => {
        console.error(`Error starting server: ${error.message}`)
    })