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
     console.log(req.body)
    const {title,description} = req.body
    
    if(
        [title,description].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400, "All fields are required")
    }
    console.log(title,description)
    console.log(req.files)

    const VideofilePath =   req.files?.videoFile?.[0]?.path;

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

    const getAllVideos = asyncHandler(async (req,res)=>{
        const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query
        //TODO: get all videos based on query, sort, pagination
        //first convert all string to int
        //create a matchcondition object to get the video of same match
        //in matchconditon add ispublished,userId(if there),query,
        //sort aggreagate through sortby and sorttype
        //add an aggreagation pipeline,for match,sort and lookup to get the information of the video owner
        const pageNum  = parseInt(page,10)
        const limitNum = parseInt(limit,10)
        console.log(query)
        const matchCondition = {
            isPublished: true
        }
        console.log(userId)
        if(userId){
            matchCondition.owner  = userId
        }

        if(query){
            matchCondition.$or = [
                {title:{$regex:query, $options:"i"}},
                {description:{$regex:query, $options:"i"}},   
            ]
        }
        const sortOption = {
            [sortBy]: sortType === "asc"? 1:-1
        }
        console.log(matchCondition.$or)
        const allVideos = [
            {$match: matchCondition},
            {$sort: sortOption},
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner"
                    // all the videos which are shown have the information of their owner
                }
            },
            {
                $unwind: {
                    path: "$owner",
                    preserveNullAndEmptyArrays: true
                }
            },
        ]
        if(!allVideos){
            throw new ApiError(500,"Videos can't be aggreagate")
        }

        // const videosObject = allVideos.reduce((acc, video) => {
        //  acc[video._id.toString()] = video;
        //  return acc;
        //  }, {});

        // console.log(videosObject) 
        const options = {
            page: pageNum,
            limit: limitNum
        };
    
        const result = await Video.aggregatePaginate(Video.aggregate(allVideos), options);
        console.log(result)
        if(!result){
            throw new ApiError(500,"Videos cannot be fetched")
        }
        //  console.log("here is hte problem")

        return res.
        status(200)
        .json(new ApiResponse(200,result,"Videos Fetched "))

    })//working well needs to be improved, needs to add more preference


const getVideosbyId = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    console.log("videoId:", videoId)
  
    if (!videoId) {
      throw new ApiError(400, "VideoID is not present")
    }
    
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(500,"VideoId is not Valid")
      }
    const Videoplay = await Video.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(videoId)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner"
        }
      },
      {
        $unwind: {
          path: "$owner",
          preserveNullAndEmptyArrays: true
        }
      }
    ])
  
    if (!Videoplay || Videoplay.length === 0) {
      throw new ApiError(404, "Searched video is not available")
    }
  
    res.status(200).json(new ApiResponse(200, Videoplay[0], "Video is presented"))
  })

  const deleteVideobyId = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(400,"Video id is not present or fetched")
    }
    try {
        await Video.findByIdAndDelete(videoId)
        
    } catch (error) {
       throw new ApiError(401,"Video cannot be Deleted or not available") 
    }
    res.status(200)
    .json(new ApiResponse(201,"Video is deleted"))
})//need testing

const togglePublishStatus = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(400,"Video id is not present or fetched")
    }
    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {$set:{isPublished:!videoId.isPublished}},
        {new:true}
    )
    if(!updatedVideo){
        throw new ApiError(201,"Video cannot be updated")
    }
    return res.status(200)
    .json(new ApiResponse(200,updatedVideo,"Video is updated"))
    
})


export {publishVideo,
        getAllVideos,
        getVideosbyId,
        deleteVideobyId,
        togglePublishStatus
}
