import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, duration } = req.body;

    // Check if user is logged in
    if (!req.user) {
        throw new ApiError(401, 'User not logged in');
    }

    // Check if video file and thumbnail are provided
    if (!req.files || !req.files.videofile || !req.files.thumbnail) {
        throw new ApiError(400, 'Video file and thumbnail are required');
    }

    // Upload video file and thumbnail to Cloudinary
    const videoUploadResult = await uploadOnCloudinary(req.files.videofile[0].path);
    const thumbnailUploadResult = await uploadOnCloudinary(req.files.thumbnail[0].path);

    if (!videoUploadResult || !thumbnailUploadResult) {
        throw new ApiError(500, 'Failed to upload video or thumbnail');
    }

    // Create video record
    const video = new Video({
        videofile: videoUploadResult.secure_url,
        thumbnail: thumbnailUploadResult.secure_url,
        title,
        description,
        duration,
        owner: req.user._id,
    });

    await video.save();

    res.status(201).json(new ApiResponse(201, 'Video published successfully', video));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
