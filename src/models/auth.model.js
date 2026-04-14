import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String
})

userSchema.methods.comparePassword = function (clientPass) {
    return this.password === clientPass
}

const userModel = mongoose.model("USER", userSchema);

export default userModel