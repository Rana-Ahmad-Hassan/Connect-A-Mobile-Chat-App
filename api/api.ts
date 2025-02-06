import axios from "axios";

export const api = axios.create({
    baseURL: "https://c6d1-103-186-78-241.ngrok-free.app",
    headers: {
        "Content-Type": "application/json",
    },
})