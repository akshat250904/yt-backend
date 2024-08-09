import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Channel } from "../models/channel.model.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!req.user) {
        throw new ApiError(401, "User not logged in");
    }

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const userId = req.user._id;

    let subscription = await Subscription.findOne({ channel: channelId, subscriber: userId });

    const channel = await Channel.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    if (subscription) {
        // Unsubscribe if already subscribed
        await subscription.remove();
        channel.subscribersCount -= 1;
    } else {
        // Subscribe if not already subscribed
        subscription = new Subscription({ channel: channelId, subscriber: userId });
        await subscription.save();
        channel.subscribersCount += 1;
    }

    await channel.save();

    return res.status(200).json(new ApiResponse(200, subscription, subscription ? "Subscribed successfully" : "Unsubscribed successfully"));
});
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!req.user) {
        throw new ApiError(401, "User not logged in");
    }

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const subscribers = await Subscription.find({ channel: channelId }).populate('subscriber', 'username');

    return res.status(200).json(new ApiResponse(200, subscribers, "Subscribers retrieved successfully"));
});
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!req.user) {
        throw new ApiError(401, "User not logged in");
    }

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID");
    }

    const subscribedChannels = await Subscription.find({ subscriber: subscriberId }).populate('channel', 'name');

    return res.status(200).json(new ApiResponse(200, subscribedChannels, "Subscribed channels retrieved successfully"));
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}