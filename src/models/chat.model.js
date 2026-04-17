import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    chat: String,
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ROOM'
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER'
    }
}, { timestamps: true })

chatSchema.index({ room: 1, createdAt: -1 })

const chatModel = mongoose.model("CHAT", chatSchema)

export default chatModel