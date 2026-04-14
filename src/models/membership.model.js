import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ROOM'
    },
    joined_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER'
    }
})

const memberModel = mongoose.model("MEMBER", memberSchema)

export default memberModel