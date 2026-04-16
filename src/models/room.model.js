import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    room_name: String,
    type: {
        type: String,
        enum: ["group", "dm"],
        default: "dm"
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER'
    }
})

const roomModel = mongoose.model("ROOM", roomSchema)

export default roomModel