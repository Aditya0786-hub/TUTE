import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { Video } from "../models/video.models.js";
import {getVideoDurationInSeconds} from "get-video-duration"
import mongoose from "mongoose";
import { Types } from "mongoose";

const publishVideo = asyncHandler(async(req,res)=>{
    //get the title and description from user and validate
    //get the videofile and thumbnail from user and validate
    //upload the video and thumbnail on cloudinary and validate
    //get the duration using a  external pakakge
    //post the newvideo document
    //return the response

    const {title,description} = req.body

    if(
        [title,description].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400, "All fields are required")
    }
    // console.log(title,description)
    console.log(req.files)
    const VideofilePath =  req.files?.videoFile?.[0]?.path;
    if(!VideofilePath){
        throw new ApiError(401,"VideoFile is required")
    }
    const ThumbnailPath =   req.files?.thumbnail[0]?.path;
    if(!ThumbnailPath){
        throw new ApiError(401,"Thumbnail is required")
    }
    const videoFile = await uploadOnCloudinary(VideofilePath)
    const thumbnail = await uploadOnCloudinary(ThumbnailPath)
    
    if (!videoFile?.url || !thumbnail?.url) {
        throw new ApiError(500, "File upload to cloud failed");
    }

     const duration = await getVideoDurationInSeconds(VideofilePath);
      if(!duration) {
       throw new ApiError(501,"Canno get video duration")
     }

    const newVideo = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration,
        owner: req.user._id, 
        isPublished: true
    })
    if(!newVideo){
        throw new ApiError(501,"Video cannot be Uploaded")
    }

    return res.
    status(201)
    .json(
        new ApiResponse(201,newVideo,"Video Successfully Uploaded")
    )
    
})

export {publishVideo}
