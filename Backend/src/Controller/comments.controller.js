import mongoose, { isValidObjectId, Mongoose, } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Comment } from "../models/comments.models.js";
import { Video } from "../models/video.models.js";

//to add comment Api
const addComment = asyncHandler( async(req,res)=>{
    const {videoId} = req.params
    const {content} = req.body
    if(!content){
        throw new ApiError(400,"Comment something or Comment not provided")
    }
    if(!videoId){
        throw new ApiError(400,"VideoId is not present")
    }
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"VideoId is not valid ObjectId")
    }
    const VideoId = new mongoose.Types.ObjectId(videoId)
    // const video = await Video.findById(videoId)
    try {
        const comment = await Comment.create({
            content: content,
            video: VideoId,
            owner: req.user._id
        })
        res.status(200)
        .json(
            new ApiResponse(200,comment,"Comment added!")
        )
    } catch (err) {
        throw new ApiError(400,"Comment not Added!")
    }
  
})

export {addComment}