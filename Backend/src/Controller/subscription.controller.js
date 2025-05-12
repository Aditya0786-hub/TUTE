import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";

//toggle subscription
const toggleSubscription = asyncHandler(async (req,res)=>{
   //get username from url
   //find the username doc from user model
   //if in subs model the userid and channelid exist ,
   //then remove the subscription doc,
   //then create a new doc
    try {
        const { username } = req.params;
        const ChannelId = await User.findOne({
            username: username
        })
        console.log(ChannelId)
        if(!ChannelId){
            throw new ApiError(401,"ChannelId not found")
        }
        console.log(ChannelId)
        //if the subscription already exists
        const existedSubscription = await Subscription.findOne({
            subscriber: req.user._id,
            channel: ChannelId._id
        })
        if(existedSubscription){
            await Subscription.deleteOne({_id:existedSubscription._id})
            return res.status(200).json({ message: "Unsubscribed successfully." });
        }
        else{
            await Subscription.create({
                subscriber: req.user._id,
                channel: ChannelId._id
            })
            return res.status(200).json({ message: "Subscribed successfully." });
        }
    } catch (err) {
        return res.status(401).json({message:"something went worng"})
    }
    
    
});