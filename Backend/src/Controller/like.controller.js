import mongoose from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Mongoose } from "mongoose"
import { Video } from "../models/video.models.js"
import { Like } from "../models/like.models.js"
import { Comment } from "../models/comments.models.js"

const toggleLike = asyncHandler(async(req,res)=>{
     const {videoId} = req.params
     if(!videoId || mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"VideoID is not valid")
     }
     try {
        await Video.findById(videoId)
     } catch (error) {
        throw new ApiError(400,"Video is not present")
     }
     const like = await Like.create({
      video: videoId,
      likedBy: req.user._id
     })
     res.status(200)
     .json(
      new ApiResponse(200, like, "Video liked")
     )
     
})

const toggleCommentLike = asyncHandler(async(req,res)=>{
     const {commentId} = req.params
     if(!commentId || mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400,"Comment is not valid")
     }
     try {
        await Comment.findById(commentId)
     } catch (error) {
        throw new ApiError(400,"Comment is not present")
     }
     const like = await Like.create({
      video: commentId,
      likedBy: req.user._id
     })
     res.status(200)
     .json(
      new ApiResponse(200, like, "Comment liked")
     )
})




    
