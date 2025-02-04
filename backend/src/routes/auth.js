import { Router } from "express";
import { getMe, searchUsers, signin, signup } from "../controllers/auth.js";
import { protect } from "../middlewares/auth.js";


export const authRouter = Router();
authRouter.post("/signUp", signup)
authRouter.post("/signIn", signin)
authRouter.get("/getMe", protect, getMe)
authRouter.get("/search", protect, searchUsers)