import express from "express";
import { createServer } from "http";
import authRouter from "./routes/auth.route";
import cookieParser from "cookie-parser";


const app = express();
app.use(express.json())
app.use(cookieParser())
const httpServer = createServer(app);

app.use("/api/auth", authRouter)

export default httpServer;