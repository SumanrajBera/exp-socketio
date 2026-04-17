import express from "express";
import { createServer } from "http";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/message.route.js";


const app = express();
app.use(express.json())
app.use(cookieParser())
const httpServer = createServer(app);

app.use("/api/auth", authRouter)
app.use("/api/chat", messageRouter)

export default httpServer;