import { Router } from "express";
import userModel from "../models/auth.model";
import jwt from 'jsonwebtoken'

const authRouter = Router()

function sendToken(username, id, message, res, status) {
    const token = jwt.sign({
        username, id
    }, process.env.JWT_SECRET, { expiresIn: "3d" })
    res.cookie("token", token)
    res.status(status).json({
        message
    })
}

authRouter.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const newUser = await userModel.create({ username, password })

    sendToken(username, newUser._id, "User registered successfully", res, 201)
})

authRouter.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await userModel.findOne({
        username
    })

    if (!user) {
        return res.status(400).json({
            message: "Invalid Credential"
        })
    }

    const checkPass = user.comparePassword(password);

    if (!checkPass) {
        return res.status(400).json({
            message: "Invalid Credential"
        })
    }
    sendToken(user.username, user._id, "User registered successfully", res, 200)
})

export default authRouter