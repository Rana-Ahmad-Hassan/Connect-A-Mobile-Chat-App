import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const JWT_SECRET = "Ahmad1122"

const JWT_EXPIRES_IN = "7d";

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        console.log("User saved:", newUser);

        const token = jwt.sign(
            { id: newUser._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );


        res.status(201).json({
            message: "User registered successfully",
            token,
            user: { id: newUser._id, username: newUser.username, email: newUser.email },
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        res.status(200).json({
            token,
            user: { id: user._id, username: user.username, email: user.email },
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};


export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const searchUsers = async (req, res) => {
    try {
        // Ensure query parameter is present
        if (!req.query.query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const { query } = req.query;
        const userId = req.user._id; // Assuming the user ID is stored in `req.user._id`

        // Search for users by username, excluding the current logged-in user
        const users = await User.find({
            username: { $regex: query, $options: 'i' }, // Case-insensitive search
            _id: { $ne: userId } // Exclude the current logged-in user
        }).select('-password'); // Don't return password field

        // Return the users found
        res.status(200).json(users);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Server error" });
    }
}
