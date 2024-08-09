import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const skip = (page - 1) * limit;
    const comments = await Comment.find({ video: videoId })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('owner', 'name email'); // Adjust the fields to be populated as needed

    if (comments.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No comments found for this video"));
    }

    return res.status(200).json(new ApiResponse(200, comments, "Comments retrieved successfully"));
});

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    if(!req.user){
        throw new ApiError(401,"User not logged in")
    }

    const videoId = req.params.videoId
    const userId = req.user._id
    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(401,"User not found")
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(401,"Video not found")
    }

    const {content} = req.body

    const newComment = new Comment({
        content,
        video: videoId,
        owner: userId,
    })  
    
    if(!newComment){
        throw new ApiError(401,"Error while posting new comment")
    }

    await newComment.save()

    return res.status(200)
    .json(new ApiResponse(200, newComment, "Comment added successfully"))
    
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    if(!req.user){
        throw new ApiError(401,"user not logged in")
    }

    const userId = req.user._id
    const commentId = req.params.commentId


    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(401,"User not found")
    }
    const {content} = req.body

    if(!content){
        throw new ApiError(401,"Content can not be empty")
    }
    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {content: content},
        { new: true}
    )

    if(!comment){
        throw new ApiError(401,"Comment can't be posted")
    }

    await comment.save()

    return res.status(200)
    .json(new ApiResponse(200, comment, "Comment Updated Successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    if(!req.user){
        throw new ApiError(401,"User not logged in")
    }

    const userId = req.user._id
    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(401,"User not found")
    }

    const commentId = req.params.commentId
    

    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(401,"Comment not found")
    }
    const ownerId = comment.owner

    if(ownerId.toString() !== userId.toString()){
        throw new ApiError(401,"You do not have access to delete the comment")
    }
    
    await Comment.findByIdAndDelete(commentId)

    return res.status(200)
    .json(new ApiResponse(200, "comment deleted successfully"))

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
