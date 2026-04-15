import { config } from "dotenv";
config()

export const configApp = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET
}