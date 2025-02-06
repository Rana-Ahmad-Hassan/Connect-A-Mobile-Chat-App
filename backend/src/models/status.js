import mongoose from "mongoose";

const { Schema, model } = mongoose;

const statusSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        mediaUrl: {
            type: String, // Store the URL of the photo or video
            required: true,
        },
        mediaType: {
            type: String,
            enum: ["image", "video"], // Ensure only images or videos are uploaded
            required: true,
        },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
            index: { expires: "24h" }, // Auto-delete after 24 hours
        },
    },
    { timestamps: true }
);

export const Status = model("Status", statusSchema);
