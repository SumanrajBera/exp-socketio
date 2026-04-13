import { Server } from "socket.io";
import httpServer from "./app.js";

const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
    console.log("Connected to Socket.io server")
});

export default io;