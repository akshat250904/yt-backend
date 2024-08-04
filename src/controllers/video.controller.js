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
    console.log('Request received for publishing a video');

    if (!req.user) {
        throw new ApiError(401, 'User not logged in');
    }

    const { title, description, duration } = req.body;

    if (!req.files || !req.files.videofile || !req.files.thumbnail) {
        console.error('Video file and thumbnail are required');
        throw new ApiError(400, 'Video file and thumbnail are required');
    }

    const videoFileLocalPath = req.files.videofile[0]?.path;
    const thumbnailLocalPath = req.files.thumbnail[0]?.path;

    if (!videoFileLocalPath || !thumbnailLocalPath) {
        console.error('Failed to get video file or thumbnail');
        throw new ApiError(400, 'Failed to get video file or thumbnail');
    }

    try {
        const videoUploadResult = await uploadOnCloudinary(videoFileLocalPath);
        const thumbnailUploadResult = await uploadOnCloudinary(thumbnailLocalPath);

        if (!videoUploadResult || !thumbnailUploadResult) {
            console.error('Failed to upload video or thumbnail');
            throw new ApiError(500, 'Failed to upload video or thumbnail');
        }

        const video = new Video({
            videofile: videoUploadResult.secure_url,
            thumbnail: thumbnailUploadResult.secure_url,
            title,
            description,
            duration: duration || videoUploadResult.duration,
            owner: req.user._id,
        });

        await video.save();

        const createdVideo = await Video.findById(video._id).select('-__v');

        if (!createdVideo) {
            console.error('Something went wrong while publishing the video');
            throw new ApiError(500, 'Something went wrong while publishing the video');
        }

        console.log('Video published successfully');
        return res.status(201).json(new ApiResponse(201, createdVideo, 'Video published successfully'));

    } catch (error) {
        console.error('Error publishing video:', error);
        throw new ApiError(500, 'Server error');
    }
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if(!isValidObjectId(videoId)){
        throw new ApiError(401,"Invalid Video ID")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(402,"video is not available")
    }

    res.status(200)
    .json(new ApiResponse(200, video, "video retrieved successfully"))

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description, thumbnail } = req.body;

    if(!req.user){
        throw new ApiError(401,"Login neccessary for this operation")
    }

    if(!videoId){
        throw new ApiError(401,"Invalid video id")
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(402,"video not found")
    }

    const updatefields = {
        title,
        description,
    }

    const updatedfields = await Video.findByIdAndUpdate(
        videoId,
        {$set: updatefields},
        {new: true}
    )


    return res.status(200)
    .json(new ApiResponse(200, video,"updation successful"))
    
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    if(!req.user){
        throw new ApiError(401,"User not logged in")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(401,"invalid video id")
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(400,"video not found")
    }

    if (video.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "User not authorized to delete this video");
    }

    await Video.findByIdAndDelete(videoId)

    return res.status(200)
    .json(new ApiResponse(200, "video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!req.user){
        throw new ApiError(401,"invalid user")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(401,"video not found")
    }

    if(video.userId !== req.user._id){
        throw new ApiError(403,"not authorized to do the function")
    }

    video.isPublished = !video.isPublished;
    // console.log(video)
    await video.save()
    //console.log(video)
    return res.status(200)
    .json(new ApiResponse(201, video, "publish status updated successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
