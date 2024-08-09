import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "User not logged in");
    }

    const { videoId } = req.params;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const like = await Like.findOne({ video: videoId, likedBy: userId });

    if (like) {
        await like.deleteOne(); // If already liked, remove the like
        return res.status(200).json(new ApiResponse(200, null, "Video unliked successfully"));
    } else {
        await Like.create({ video: videoId, likedBy: userId }); // If not liked yet, add a like
        return res.status(200).json(new ApiResponse(200, null, "Video liked successfully"));
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "User not logged in");
    }

    const { commentId } = req.params;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const like = await Like.findOne({ comment: commentId, likedBy: userId });

    if (like) {
        await like.deleteOne(); // If already liked, remove the like
        return res.status(200).json(new ApiResponse(200, null, "Comment unliked successfully"));
    } else {
        await Like.create({ comment: commentId, likedBy: userId }); // If not liked yet, add a like
        return res.status(200).json(new ApiResponse(200, null, "Comment liked successfully"));
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "User not logged in");
    }

    const { tweetId } = req.params;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const like = await Like.findOne({ tweet: tweetId, likedBy: userId });

    if (like) {
        await like.deleteOne(); // If already liked, remove the like
        return res.status(200).json(new ApiResponse(200, null, "Tweet unliked successfully"));
    } else {
        await Like.create({ tweet: tweetId, likedBy: userId }); // If not liked yet, add a like
        return res.status(200).json(new ApiResponse(200, null, "Tweet liked successfully"));
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "User not logged in");
    }

    const userId = req.user._id;

    const likedVideos = await Like.find({ likedBy: userId, video: { $exists: true } }).populate('video');

    if (likedVideos.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No liked videos found"));
    }

    return res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos retrieved successfully"));
});



export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}