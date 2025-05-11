import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"

const generateAccessandRefreshTokens = async(userID)=>{
    try {
        const user = await User.findById(userID)
        const accessToken = user.generateAccessToken()
        
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        
    }
}

const registerUser = asyncHandler(async (req,res) => {
    //1.get user detailed from frontend
    //2validation - not empty
    //3.check if user already is there
    //4.check for images check for  avatar
    //5. upload on cloudinary
    //6.create user object - create netry in  db
    //7.remove password and refresh token  from response
    //8.check for user creation
    //9.return response3.
    const {fullName, email, username, password} = req.body //it gets the data from frontend
    console.log("email: ", email);

    
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    } //it checks whether the data exist or not

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })//it checks if user already exist

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const loginUser = asyncHandler( async (req, res)=>{
    // console.log(req.body)
       const {email, username, password} = req.body
    //    console.log(username)
    //    console.log(password)
    //    console.log(email)

       if(!(username || email)){
        throw new ApiError(400, "username or email is required")
       }

       const user = await User.findOne({
        $or: [{username}, {email}]
       })

       if(!user){
        throw new ApiError(400, "Invalid Credentials")
       }
       
       const isPassowordValid = await user.isPasswordCorrect(password)

       if(!isPassowordValid){
        throw new ApiError(400,"Password is not correct")
       }

      const {accessToken, refreshToken} = await 
      generateAccessandRefreshTokens(user._id)
    //   console.log(accessToken)
    //   console.log(refreshToken)

      const loggedInUser = await User.findById(user._id).
      select("-password -refreshToken")
      
      const option = {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
      }

      return res
      .status(200)
      .cookie("accessToken", accessToken,option)
      .cookie("refreshToken", refreshToken,option)
      .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,accessToken,refreshToken
            },
            "user logged in Succesfully"
        )
      )
})

const logoutUser = asyncHandler(async(req,res)=>{
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new:true
        }
    )
    const option = {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
        
        // in production but in dev false
      }

      return res
      .status(200)
      .clearCookie("accessToken", option)
      .clearCookie("refreshToken", option)
      .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async(req, res)=>{
    const incomingRefreshToken = req.cookies.
    refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "IncomingRefresh Token is invalid!")
    }

    const DecodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )
     try{
   const user =  await User.findById(DecodedToken?._id)

    if (!user) {
        throw new ApiError(401, "Invalid refresh token")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or used")
        
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    const {accessToken, newRefreshToken} = await generateAccessandRefreshTokens(user._id)

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {accessToken, refreshToken: newRefreshToken},
            "Access token refreshed"
        )
    )
} catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
}


})

// update controllers

const UpdatePassword = asyncHandler(async(req,res)=>{
    const {newPassword,OldPassword} = req.body
    //  console.log(newPassword)
    //  console.log(OldPassword)
    const user = await User.findById(req.user._id)//req.user is refering to middleware 
    // console.log(user)
    if(!user){
        throw new ApiError("401","User not logged in")
    }
    
    const isPassowordValid = await user.isPasswordCorrect(OldPassword) // here is a error I encounter which is if 
    //i do not use await it will return a promise so it means
    /*“I’m working on getting the user from the database, but it’s not ready yet.”
        So, user is not the actual user object — it's a wrapper (a Promise) that will eventually resolve into the user object.*/

    if(!isPassowordValid){
        throw new ApiError(401,"Invalid Old Password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))

    
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullName,username} = req.body
    if(!(fullName || username)){
        throw new ApiError(401,"All Fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
})

const ChangeAvatar = asyncHandler(async(req,res)=>{
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(401,"Avatar file is not present")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})

const ChangeCoverImage = asyncHandler(async(req,res)=>{
    const coverLocalPath = req.file?.path

    if(!coverLocalPath){
        throw new ApiError(401,"Avatar file is not present")
    }

    const coverImage = await uploadOnCloudinary(coverLocalPath)

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Cover image updated successfully")
    )
})
//get user channel profile
const getUserChannelProfile = asyncHandler(async (req,res)=>{
    //get the username details from middleware
    //get the one user using pipeline
    //get the subscriber count by counting the channel
    //get the subscribedTo count by countinf the subscriber
    
    const { username } = req.params //we can get the variable username throught this
    // console.log(username)

    if(!username?.trim()){
        throw new ApiError(401,"username is missing")
    }
     //pipeline to know subscribers and Susbscribedto
    const channel = await User.aggregate([
        {
            $match:{
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscription",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"

            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                SubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                SubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }

    ])

    if(!channel?.length){
        throw new ApiError(401,"Channel not showing")
    }
    
    return res
    .status(200)
    .json(
        new ApiResponse(200,channel[0],"User Channel is fetched")
    )
})

export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    UpdatePassword,
    getCurrentUser,
    updateAccountDetails,
    ChangeAvatar,
    ChangeCoverImage,
    getUserChannelProfile
    

}