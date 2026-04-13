import express from "express";
import { createServer } from "http";

const app = express();
app.use(express.json())
const httpServer = createServer(app);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Working"
    })
})

export default httpServer;