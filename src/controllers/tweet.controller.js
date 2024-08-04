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
    //TODO: update tweet
    if(!req.user){
        throw new ApiError(401,"User is not logged in")
    }

    const userId = req.user._id;
    const tweetId = req.params.tweetId

    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(401,"User not found")
    }

    const {content} = req.body
    
    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {content},
        {new: true}
    )

    if(!tweet){
        throw new ApiError(401,"Tweet not found")
    }

    return res.status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    if(!req.user){
        throw new ApiError(401,"User not logged in")
    }

    const userId = req.user._id
    const tweetId = req.params.tweetId

    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(401,"user not found")
    }

    const tweet = await Tweet.findByIdAndDelete(tweetId)

    return res.status(200)
    .json(new ApiResponse(200,"tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
