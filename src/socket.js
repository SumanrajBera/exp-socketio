import { Server } from "socket.io";
import httpServer from "./app.js";
import roomModel from "./models/room.model.js";
import memberModel from "./models/membership.model.js";
import { parseCookie } from "cookie";
import jwt from "jsonwebtoken";
import { configApp } from "./config/config.js";
import mongoose from "mongoose";
import chatModel from "./models/chat.model.js";

const io = new Server(httpServer, {});

io.use((socket, next) => {
    try {
        const cookies = parseCookie(socket.handshake.headers.cookie || "")

        if (!cookies.token) throw new Error("Authentication required");

        const isVerified = jwt.verify(cookies.token, configApp.JWT_SECRET)

        socket.data.username = isVerified.username;
        socket.data.id = isVerified.id

        return next()
    } catch (err) {
        return next(new Error("Authentication required"));
    }
})

io.on("connection", async (socket) => {
    console.log("Connected to Socket.io server", socket.data.id, socket.data.username)

    const memberships = await memberModel.find({ user: socket.data.id })
    memberships.forEach(membership => socket.join(membership.room.toString()))

    socket.on("create-room", async (data) => {
        try {
            const { room } = data;

            if (!room) {
                return socket.emit("room-error", {
                    message: "Room requires a name"
                });
            }

            const newRoom = await roomModel.create({ room_name: room, type: "group", created_by: socket.data.id })
            await memberModel.create({ room: newRoom._id, user: socket.data.id })

            socket.join(newRoom._id.toString())

            return socket.emit("room-success", { message: "Room created" })
        } catch (err) {
            return socket.emit("room-error", { message: "Failed to create room" })
        }

    })

    socket.on("join-room", async (data) => {
        try {
            const { roomId } = data;

            if (!roomId) {
                return socket.emit("room-error", {
                    message: "Room not specified"
                });
            }

            if (!mongoose.Types.ObjectId.isValid(roomId)) {
                return socket.emit("room-error", {
                    message: "Invalid room id"
                });
            }

            const roomExist = await roomModel.findOne({ _id: roomId })

            if (!roomExist) return socket.emit("room-error", { message: "Either the room doesn't exist or was deleted" })

            const existingMember = await memberModel.findOne({
                room: roomExist._id,
                user: socket.data.id
            });

            if (!existingMember) {
                await memberModel.create({
                    room: roomExist._id,
                    user: socket.data.id
                });
            }

            socket.join(roomExist._id.toString())

            return socket.emit("room-success", { message: "Joined room successfully" })
        } catch (err) {
            return socket.emit("room-error", { message: "Failed to join room" })
        }
    })

    socket.on("start-dm", async (data) => {
        try {
            const { userId } = data;

            const rooms = await memberModel.find({ user: socket.data.id }).populate("room");
            const dmRooms = rooms.filter(member => member.room.type === "dm")
            const dmRoomIds = dmRooms.map(member => member.room._id)
            const existing = await memberModel.findOne({ room: { $in: dmRoomIds }, user: userId })

            if (existing) {
                socket.join(existing.room.toString())
                return socket.emit("dm-success", { message: "Joining existing chat" })
            }

            const newRoom = await roomModel.create({ room_name: "Private chat", created_by: socket.data.id });
            await memberModel.create({ room: newRoom._id, user: socket.data.id })
            await memberModel.create({ room: newRoom._id, user: userId })

            socket.join(newRoom._id.toString())
            return socket.emit("dm-success", { message: "Connection made with user" })
        } catch (err) {
            console.log(err)
            return socket.emit("dm-error", { message: "Couldn't Connect to the user" })
        }

    })

    socket.on("send-message", async (data) => {
        try {
            const { roomId, message } = data

            if (!mongoose.Types.ObjectId.isValid(roomId)) {
                return socket.emit("room-error", {
                    message: "Invalid room id"
                });
            }

            if (message === "") {
                return socket.emit("message-error", {
                    message: "Chat can't be empty"
                })
            }

            const isMember = await memberModel.findOne({ user: socket.data.id, room: roomId });
            if (!isMember) {
                return socket.emit("room-error", {
                    message: "You are not member of this room"
                });
            }

            await chatModel.create({ chat: message, room: roomId, created_by: socket.data.id });

            return io.to(roomId.toString()).emit("message-success", { message, username: socket.data.username })
        } catch (err) {
            return socket.emit("message-error", { message: "Failed to send message" })
        }
    })
});

export default io;