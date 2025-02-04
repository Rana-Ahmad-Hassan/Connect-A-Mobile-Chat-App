import { Router } from "express";
import { createConversation, getAllConversations, getMessages, sendMessage } from "../controllers/message.js";
import { protect } from "../middlewares/auth.js";

export const messageRouter = Router();


messageRouter.get("/allConversations", protect, getAllConversations);
messageRouter.get("/:id", protect, getMessages);
messageRouter.post("/send/:id", protect, sendMessage);
messageRouter.post("/create/:id", protect, createConversation);

