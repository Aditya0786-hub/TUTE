import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";

//toggle subscription
const toggleSubscription = asyncHandler(async (req, res) => {
  //get username from url
  //find the username doc from user model
  //if in subs model the userid and channelid exist ,
  //then remove the subscription doc,
  //then create a new doc
  try {
    const { username } = req.params;
    const ChannelId = await User.findOne({
      username: username,
    });
    console.log(ChannelId);
    if (!ChannelId) {
      throw new ApiError(401, "ChannelId not found");
    }
    console.log(ChannelId);
    //if the subscription already exists
    const existedSubscription = await Subscription.findOne({
      subscriber: req.user._id,
      channel: ChannelId._id,
    });
    if (existedSubscription) {
      await Subscription.deleteOne({ _id: existedSubscription._id });
      return res.status(200).json({ message: "Unsubscribed successfully." });
    } else {
      await Subscription.create({
        subscriber: req.user._id,
        channel: ChannelId._id,
      });
      return res.status(200).json({ message: "Subscribed successfully." });
    }
  } catch (err) {
    return res.status(401).json({ message: "something went worng" });
  }
});

const getchannelSubscriber = asyncHandler(async (req, res) => {
  const { Channelusername } = req.body;
  const ChannelId = await User.findOne({
    username: Channelusername,
  });
  console.log(ChannelId);
  if (!ChannelId) {
    throw new ApiError(401, "ChannelId not found");
  }
  const subscribers = await Subscription.find({
    channel: ChannelId._id,
  });
  console.log(subscribers);
  if (subscribers) {
    return res
      .status(200)
      .json(new ApiResponse(201, subscribers, "Subscriber list fetched"));
  }
  //fully woking
});

const getUserSubscribedChannel = asyncHandler(async (req, res) => {
  
  const subscriptions = await Subscription.aggregate([
    {
      $match: {
        subscriber: req.user._id, // filter by subscriber (user who subscribed to channels)
      },
    },
    {
      $lookup: {
        from: "users", // collection to join with (check your model name, mongoose pluralizes)
        localField: "channel", // field in Subscription schema pointing to channel id
        foreignField: "_id",   // field in User collection
        as: "channelDetails",  // output array
      },
    },
    {
      $unwind: "$channelDetails", // flatten array to object
    },
    {
      $project: {
        _id: 0,
        subscribedChannelId: "$channelDetails._id",
        username: "$channelDetails.username",
        email: "$channelDetails.email",
        avatar: "$channelDetails.avatar",
        subscribedAt: "$createdAt",
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, subscriptions, "Subscribed channel list fetched"));
});
  //fully woking


export { toggleSubscription, getchannelSubscriber, getUserSubscribedChannel };
