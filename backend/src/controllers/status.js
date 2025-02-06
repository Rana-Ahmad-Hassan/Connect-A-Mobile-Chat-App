import { User } from "../models/user.js";
import { Conversation } from "../models/conversation.js";
import { Status } from "../models/status.js";
import { supabase } from "../../supabase.js";

const SUPABASE_URL = "https://fvjjuajypppiwhrmodxj.supabase.co"

export const uploadStatus = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }


        console.log("Uploaded file:", req.file);
        const file = req.file;
        const filePath = `statuses/${req.user._id}/${Date.now()}-${file.originalname}`;

        // Upload file to Supabase
        const { data, error } = await supabase.storage
            .from("status-media")
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                cacheControl: "3600",
                upsert: false,
            });

        if (error) {
            console.error("Supabase Upload Error:", error);
            return res.status(500).json({ message: "Supabase upload failed", error });
        }

        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/status-media/${filePath}`;

        const newStatus = new Status({
            user: req.user._id,
            mediaUrl: publicUrl,
            mediaType: file.mimetype.startsWith("image") ? "image" : "video",
        });

        await newStatus.save();
        const userStatus = await User.findByIdAndUpdate(req.user._id, { $push: { statuses: newStatus._id } }, { new: true });


        res.status(201).json({ message: "Status uploaded successfully", status: newStatus });
    } catch (error) {
        console.error("Error Uploading Status:", error);
        res.status(500).json({ message: "Error uploading status", error });
    }
};


export const feedStatus = async (req, res) => {
    try {
        // Find users the logged-in user has a conversation with
        const conversations = await Conversation.find({ participants: req.user._id }).populate("participants");

        // Extract unique user IDs from conversations (excluding the logged-in user)
        const userIds = new Set();
        conversations.forEach(conversation => {
            conversation.participants.forEach(user => {
                if (user._id.toString() !== req.user._id.toString()) {
                    userIds.add(user._id.toString());
                }
            });
        });

        // Fetch statuses of these users
        const statuses = await Status.find({ user: { $in: [...userIds] } }).populate("user", "username");

        res.status(200).json(statuses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const getLoggedInUserStatuses = async (req, res) => {
    try {
        const userId = req.user._id;
        const userStatuses = await Status.find({ user: userId }).sort({ createdAt: -1 })
        res.status(200).json(userStatuses);
    } catch (error) {
        console.error("Error in getLoggedInUserStatuses controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}