import { Conversation } from "../models/conversation.js";
import { Message } from "../models/message.js";
import mongoose from "mongoose";
import { io, getReceiverSocketId } from "../socket/socket.js";



export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        console.log(receiverId, senderId.toString())


        const participants = [
            new mongoose.Types.ObjectId(senderId),
            new mongoose.Types.ObjectId(receiverId)
        ].sort((a, b) => a.toString().localeCompare(b.toString()));

        let conversation = await Conversation.findOne({
            participants: participants
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants,
                messages: [],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(), newMessage.save()]);

        const receiverSocketId = getReceiverSocketId(receiverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getMessages = async (req, res) => {
    try {
        const { id: conversationId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
            return res.status(400).json({ error: "Invalid conversation ID" });
        }

        const conversation = await Conversation.findById(conversationId).populate("messages");

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getAllConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log("User ID: ", userId);

        const conversations = await Conversation.find({
            participants: { $in: [userId] },
        }).populate("participants", "-password");

        if (conversations.length === 0) {
            return res.status(404).json({ message: "No conversations found" });
        }

        const filteredConversations = conversations.map(conversation => {
            return {
                ...conversation.toObject(),
                participants: conversation.participants.filter(
                    participant => participant._id.toString() !== userId.toString()
                )
            };
        });

        res.status(200).json(filteredConversations);
    } catch (error) {
        console.log("Error in getAllConversations controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createConversation = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ 
                success: false,
                error: "Invalid receiver ID format" 
            });
        }

        // Prevent self-conversation
        if (senderId.equals(receiverId)) {
            return res.status(400).json({
                success: false,
                error: "Cannot create conversation with yourself"
            });
        }

        const participants = [
            new mongoose.Types.ObjectId(senderId),
            new mongoose.Types.ObjectId(receiverId)
        ].sort((a, b) => a.toString().localeCompare(b.toString()));

        const existingConversation = await Conversation.findOne({
            participants: participants
        }).populate('participants', '-password');

        if (existingConversation) {
            return res.status(200).json({
                success: true,
                message: "Conversation already exists",
                conversation: existingConversation
            });
        }

        // Create new conversation
        const newConversation = await Conversation.create({
            participants,
            messages: [],
        });

        // Populate the participants for response
        const populatedConversation = await Conversation.findById(newConversation._id)
            .populate('participants', '-password');

        res.status(201).json({
            success: true,
            message: "Conversation created successfully",
            conversation: populatedConversation
        });

    } catch (error) {
        console.error("Error in createConversation controller:", error.message);
        res.status(500).json({ 
            success: false,
            error: "Internal server error" 
        });
    }
};

