import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    hash: {
        type: String
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: [String]
}, { timestamps: true })

const User = mongoose.model('User', userSchema)
export default User