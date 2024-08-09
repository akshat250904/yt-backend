import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"       //community post
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    // Check if user is logged in or not
    if (!req.user) {
        throw new ApiError(400, "User not logged in");
    }

    const userId = req.user._id;

    const user = await User.findById(userId);
    console.log(user);

    if (!user) {
        throw new ApiError(400, "User not found");
    }

    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Tweet can't be empty");
    }

    const newTweet = new Tweet({
        content,
        owner: userId
    });

    await newTweet.save();

    return res.status(200).json(new ApiResponse(200, newTweet, "Tweeted successfully"));
})

const getUserTweets = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "User not logged in")
    }

    const userId = req.user._id

    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(401, "User not found")
    }

    const userTweets =  await Tweet.find({owner: userId})

    return res.status(200)
    .json(new ApiResponse(200, userTweets, "Tweets retrieved successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "User not logged in");
    }

    const userId = req.user._id;
    const tweetId = req.params.tweetId;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Content is required to update the tweet");
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to update this tweet");
    }

    tweet.content = content;
    await tweet.save();

    return res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully"));
})

const deleteTweet = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "User not logged in");
    }

    const userId = req.user._id;
    const tweetId = req.params.tweetId;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to delete this tweet");
    }

    await Tweet.findByIdAndDelete(tweetId);

    return res.status(200).json(new ApiResponse(200, null, "Tweet deleted successfully"));
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
