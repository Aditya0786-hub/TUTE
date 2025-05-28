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

const getAllComments = asyncHandler( async(req,res)=>{
    const {videoId} = req.params
    const {page = 1,limit = 10} = req.query

     const pageNum  = parseInt(page,10)
    const limitNum = parseInt(limit,10)

    if(!videoId){
        throw new ApiError(400,"Video not found")
    }

     if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"VideoId is not valid ObjectId")
    }

    const allComments = [
        {$match:
            {
                video:  new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup:{
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: {
                path: "$owner",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                "owner._id": 1,
                "owner.username": 1,
                "owner.avatar": 1,
                // Do not include sensitive fields like tokens
            },
        }    
    ]
    console.log(allComments)
    if(!allComments){
        throw new ApiError(500,"All comments cannot be fetched")
    }

    const option = {
        page: pageNum,
        limit: limitNum
    }

    const commentResult = await Comment.aggregatePaginate(
        Comment.aggregate(allComments),
        option
    )
    console.log(commentResult)
    if(!commentResult){
        throw new ApiError(500,"Pagination Cannot be done")
    }

    res.status(200)
    .json(
        new ApiResponse(200,commentResult,"Comments successfully fetched")
    )
})

export {addComment,
    getAllComments
}