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
            type: String,
            required: true,
        },
        mediaType: {
            type: String,
            enum: ["image", "video"],
            required: true,
        },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), 
            index: { expires: "24h" },
        },
    },
    { timestamps: true }
);

export const Status = model("Status", statusSchema);
