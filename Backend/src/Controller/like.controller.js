import mongoose from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Mongoose } from "mongoose"
import { Video } from "../models/video.models.js"
import { Like } from "../models/like.models.js"
import { Comment } from "../models/comments.models.js"

const toggleLike = asyncHandler(async(req,res)=>{
   

    const { videoId, commentId } = req.body;

  // one target (video OR comment) is liked
  if ((videoId && commentId) || (!videoId && !commentId)) {
    throw new ApiError(400, "Provide either videoId or commentId, not both.");
  }

  let target;
  if (videoId) {
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(400, "Invalid videoId");
    }
    target = await Video.findById(videoId);
    if (!target) throw new ApiError(404, "Video not found");
  }

  if (commentId) {
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      throw new ApiError(400, "Invalid commentId");
    }
    target = await Comment.findById(commentId);
    if (!target) throw new ApiError(404, "Comment not found");
  }

  // Check if like already exists
  const existingLike = await Like.findOne({
    video: videoId || null,
    comment: commentId || null,
    likedBy: req.user._id,
  });

  if (existingLike) {
    // Unlike
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Unliked successfully"));
  }

  // Like
  const like = await Like.create({
    video: videoId || null,
    comment: commentId || null,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, like, "Liked successfully"));
     
})

const getLikes = asyncHandler(async(req,res)=>{
   const {videoId} = req.params
   if(!videoId && !mongoose.Types.ObjectId.isValid(videoId)){
      throw new ApiError(401,"Invalid Id or not provided")
   }
   const video = await Video.findById(videoId)
   if(!video){
      throw new ApiError(401,"Video not found")
   }

   const like = await Like.find({video:videoId})
   
   return res
   .status(200)
   .json(
      new ApiResponse(200,{likesCount: like.length},"Like Fetched")
   )

})


export {
   toggleLike,
   getLikes
}




    
