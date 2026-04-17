import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ROOM'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER'
    }
}, { timestamps: true })

memberSchema.index({ user: 1, room: 1 })
memberSchema.index({ room: 1 })

const memberModel = mongoose.model("MEMBER", memberSchema)

export default memberModel