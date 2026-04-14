import { config } from "dotenv";
import httpServer from "./src/app.js";
import io from "./src/socket.js";

config()
httpServer.listen(3000, () => {
    console.log("Server is running on port 3000")
})