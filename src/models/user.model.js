import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true,                                   //database ,m search kr skte h easily 
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        avatar: {
            type: String,
            required: true,
        },
        coverimage: {
            type: String,
        },
        watchhistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, "password is required"]
        },
        refreshToken: {
            type: String,
        },
        tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
        videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
        playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],

    }, { timestamps: true });


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcryptjs.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcryptjs.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,               //mongodb se id mil rhi h
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,               //mongodb se id mil rhi h
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)