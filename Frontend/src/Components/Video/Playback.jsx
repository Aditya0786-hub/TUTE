import React,{useState,useEffect} from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  MessageSquare,
  
} from "lucide-react";
import { useParams } from "react-router-dom";
import { VideoService } from "../../Features/Video/video.service";
import Comment from "./Comment";
import { likeService } from "../../Features/Video/like.service";
import { AuthService } from "../../Features/Auth/AuthService";
import { SubscriptionService } from "../../Features/Subscriber/subscriber.service";

const Playback = () => {

   const { videoId } = useParams();
  //  console.log(videoId)
  const [video, setVideo] = useState(null);
  const [like,setLike] = useState(null)
  const [channelDetails,setChannelDetails] = useState(null)

  useEffect(() => {
    const fectchVideoById = async () => {
      try {
        const res = await VideoService.getVideosById(videoId);
         console.log(res.data.data);
        setVideo(res.data.data);
      } catch (err) {
        console.log(err.response?.data?.message);
      }
    };

    const handleView = async()=>{
      try {
        const res = await VideoService.addViews(videoId);
         console.log(res);
      } catch (err) {
        console.log(err.response?.data?.message);
      }
    }

    const getVideoLike = async()=>{
      try {
        const res = await likeService.getVideoLike(videoId)
        console.log(res.data.data)
        setLike(res.data.data.likesCount)
      } catch (error) {
        console.loog(error.response?.data?.message || "Get Like not fetched")
      }
    }
    if (videoId) {
      fectchVideoById();
      handleView();
      getVideoLike();
      
    }
  }, [videoId]);

  useEffect(() => {
    const fetchChannel = async () => {
      if (!video?.owner?.username) return; // prevent undefined calls

      try {
        const res = await AuthService.getUserChannelProfile(
          video.owner.username
        );
        console.log(res.data.data);
        setChannelDetails(res.data.data);
      } catch (error) {
        console.log(error.response?.message || "Channel not Fetched");
      }
    };

    fetchChannel();
  }, [video]);


  const handleLike = async()=>{
    try {
      const res = await likeService.toggleLike(videoId)
      console.log(res)
      setLike((prev)=>prev+1)
    } catch (error) {
       console.loog(error.response?.data?.message || "Liked not")
    }
  }

    const handleSubscribe = async () => {
      try {
        const res = await SubscriptionService.toggleSubscription(
          channelDetails?.username
        );
       
      } catch (error) {
        console.log(error.response?.data?.message || "User not subscribed");
      }
       setChannelDetails((prev) => ({
          ...prev,
          isSubscribed: !prev.isSubscribed,
          subscribersCount: prev.isSubscribed
            ? prev.subscribersCount - 1
            : prev.subscribersCount + 1,
        }));
    };






  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section: Video + Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Player */}
          <div className="bg-black rounded-2xl overflow-hidden shadow-md aspect-video flex items-center justify-center">
            <video
                src={video?.videoFile}
                controls
                className="w-full h-full rounded-lg mb-4"
              >
                Your browser does not support the video tag.
              </video>
          </div>

          {/* Video Title */}
          <h1 className="text-xl font-semibold">
            {video?.title}
          </h1>

          {/* Views + Date + Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Eye size={16} /> {video?.views}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} /> {video?.createdAt}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handleLike} className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">
                <ThumbsUp size={18} /> {like}
              </button>
              <button className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">
                <ThumbsDown size={18} /> 234
              </button>
            </div>
          </div>

          {/* Channel Info */}
          <div className="flex items-center justify-between border-t pt-4">
            <Link to={`/profile/${video?.owner.username}`}>
            <div className="flex items-center gap-3">
              <img
                src={video?.owner.avatar}
                alt="Channel Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="font-semibold">{video?.owner.fullName}</h2>
                <p className="text-sm text-gray-500">{channelDetails?.subscribersCount} Subscribers</p>
              </div>
            </div>
            </Link>
            <button
            onClick={handleSubscribe}
            className={`px-4 py-2 ${channelDetails?.isSubscribed ? "bg-gray-100 text-black hover:bg-gray-200" : "bg-red-600"} font-semibold transition-all duration-200  rounded-full cursor-pointer`}>
              {channelDetails?.isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>
        </div>

        {/* Right Section: Comments */}
        <Comment/>
      </div>
    </div>
  );
};

export default Playback;
