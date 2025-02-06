import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import multer from "multer";
import { getLoggedInUserStatuses, uploadStatus } from "../controllers/status.js";
const upload = multer({ storage: multer.memoryStorage() });


export const statusRouter = Router()

statusRouter.post("/upload", protect, upload.single("file"), uploadStatus)
statusRouter.get("/user-status", protect, getLoggedInUserStatuses)
