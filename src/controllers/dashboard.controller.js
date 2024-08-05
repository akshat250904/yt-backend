import mongoose from "mongoose"
import { User } from "../models/user.model.js"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    if(!req.user){
        throw new ApiError(401,"User not logged in")
    }

    const userId = req.user._id
    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(401,"User not found")
    }

    const videos = await Video.find({ owner: userId.toString() });
    if (videos.length === 0) {
        throw new ApiError(401, "No videos found");
    }

    return res.status(200)
    .json(new ApiResponse(200,videos,"video retrieved successfully"))

})

export {
    getChannelStats, 
    getChannelVideos
}