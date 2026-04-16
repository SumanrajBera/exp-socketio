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

const memberModel = mongoose.model("MEMBER", memberSchema)

export default memberModel