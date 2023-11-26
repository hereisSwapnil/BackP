import mongoose, { Schema } from "mongoose";
import { jwt } from "jsonwebtoken";
import bycrpt from "bycrpt";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        // always lowercase
        lowercase: true,
        // makes unique
        unique: true,
        // trims whitespace
        trim: true,
        // this is made true if you want to make any field searchable more easily
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        // Cloudnary URL for avatar
        type: String,
        required: true
    },
    coverImage: {
        // Cloudnary URL for cover image
        type: String
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, "Passoword is required"]
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
})

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bycrpt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    },
        process.env.ACCESS_TOKEN,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRY
        })
}

const User = mongoose.model("User", userSchema)

export default User