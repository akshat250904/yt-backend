import mongoose from "mongoose"
import { User } from "../models/user.model.js"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "User not logged in");
    }

    const userId = req.user._id;

    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Convert userId to ObjectId explicitly (just in case)
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    // Get total videos count
    const totalVideos = await Video.countDocuments({ owner: objectIdUserId });

    // Get total views
    const totalViews = await Video.aggregate([
        { $match: { owner: objectIdUserId } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);

    // Get total subscribers
    const totalSubscribers = await Subscription.countDocuments({ subscribedTo: objectIdUserId });

    // Get total likes
    const totalLikes = await Like.countDocuments({ videoOwner: objectIdUserId });

    const stats = {
        totalVideos,
        totalViews: totalViews.length ? totalViews[0].totalViews : 0,
        totalSubscribers,
        totalLikes,
    };

    return res.status(200).json(new ApiResponse(200, stats, "Channel stats retrieved successfully"));
});



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