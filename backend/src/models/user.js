import mongoose from "mongoose";

const { Schema, model } = mongoose

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    statuses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Status",
        },
    ],
},
    {
        timestamps: true,
    })

export const User = model("User", userSchema)