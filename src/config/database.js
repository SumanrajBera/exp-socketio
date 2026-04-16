import mongoose from "mongoose";
import { configApp } from "./config.js";

async function connectToDB() {
    try {
        await mongoose.connect(configApp.MONGO_URI);
        console.log("Connected to DB")
    } catch (err) {
        console.log("Error connecting to DB", err)
    }
}

export default connectToDB;