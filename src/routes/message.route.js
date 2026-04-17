import { Router } from "express";
import chatModel from "../models/chat.model.js";
import memberModel from "../models/membership.model.js";
import jwt from "jsonwebtoken";
import { configApp } from "../config/config.js";

const messageRouter = Router()

messageRouter.get("/:roomId", async (req, res) => {
    try {
        const { roomId } = req.params;

        const user = jwt.verify(req.cookies.token, configApp.JWT_SECRET)

        const isMember = await memberModel.findOne({ user: user.id, room: roomId })
        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this room" })
        }

        const chats = await chatModel.find({ room: roomId }).populate("created_by").sort({ createdAt: -1 }).limit(10);

        if (chats.length < 1) {
            return res.status(200).json({
                message: "There are no chats for this room"
            })
        }

        return res.status(200).json({
            message: "Chats fetched successfully",
            chats
        })
    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch chats"
        })
    }
})

export default messageRouter;