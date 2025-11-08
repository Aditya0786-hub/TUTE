import React, { useState, useEffect } from "react";
import {
  User,
  Users,
  Play,
  Heart,
  Share2,
  MessageCircle,
  Award,
  Palette,
  Camera,
  Music,
  Code,
  Star,
  Calendar,
  MapPin,
  Settings,
  Bell,
  Gift,
  Zap,
  Trophy,
  Target,
  Briefcase,
  Clock,
  Eye,
  ThumbsUp,
  BookOpen,
  Lightbulb,
  Coffee,
} from "lucide-react";
import { AuthService } from "../Features/Auth/AuthService";
import { useSelector } from "react-redux";
import { SubscriptionService } from "../Features/Subscriber/subscriber.service";
import { Link, useParams } from "react-router-dom";
import { VideoService } from "../Features/Video/video.service";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("videos");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [currentMood, setCurrentMood] = useState("creative");
  const [profile, setChannel] = useState(null);
  const [videos, setVideos] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.auth.userData);
  const { username } = useParams();

  //For fetching user channel
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await AuthService.getUserChannelProfile(username);
        console.log(res.data.data);
        setChannel(res.data.data);
      } catch (error) {
        console.log(error.response?.message || "Channel not Fetched");
      }
    };

     const userVideos = async () => {
       const token = localStorage.getItem("accessToken");
       try {
         setLoading(true);
         const res = await VideoService.getUserVideos(user._id, token);
         console.log(res.data);
         setVideos(res.data.data.docs);
         setLoading(false);
         console.log(videos);
       } catch (error) {
         console.log(
           error?.response?.data?.message || "User Videos not fetched"
         );
         setLoading(false);
       }
     };
    if (user) {
      fetchChannel();
      userVideos();
    }
  }, [user]);

 
 

  const getAllViews = ()=>{
    let total = 0
    //videos is an array
    for( let i=0;i<videos?.length;i++){
      total += videos[0].views || 0
    }
    return total
  }


  // Format numbers
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle subscription
  const handleSubscribe = async () => {
    try {
      const res = await SubscriptionService.toggleSubscription(
        profile.username
      );
      setChannel((prev) => ({
        ...prev,
        isSubscribed: !prev.isSubscribed,
        subscribersCount: prev.isSubscribed
          ? prev.subscribersCount - 1
          : prev.subscribersCount + 1,
      }));
    } catch (error) {
      console.log(error.response?.data?.message || "User not subscribed");
    }
  };

  // Handle mood change
  const handleMoodChange = (moodId) => {
    setCurrentMood(moodId);
    setShowMoodSelector(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-purple-600 to-blue-600 overflow-hidden">
        <img
          src={profile?.coverImage}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Settings Button */}
        <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-200">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Header */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 md:-mt-20">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar with Mood Indicator */}
            <div className="relative">
              <img
                src={profile?.avatar}
                alt={profile?.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl object-cover"
              />
              {/* Mood Status Indicator */}
            </div>

            {/* Profile Info */}
            {/* Profile Info */}
            <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    {profile?.fullName}
                  </h1>
                  <p className="text-gray-600 mb-2">{profile?.username}</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-500 mb-3">
                    
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                  <button
                    onClick={handleSubscribe}
                    className={`px-6 py-3 rounded-xl cursor-pointer font-semibold transition-all duration-200 ${
                      profile?.isSubscribed
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {profile?.isSubscribed ? "Subscribed" : "Subscribe"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">
                Subscribers
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {profile?.subscribersCount}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">
                Total Views
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(getAllViews())}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-2">
              <Briefcase className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">
                Total Videos
              </span>
            
            </div>
            <p className="text-2xl font-bold text-gray-900">{videos?.length}</p>
          </div>
         
        </div>

        {/* Content Tabs */}
        <div className="mt-8">
          <div className="border-b border-gray-200">
            <nav className="flex justify-center space-x-6 sm:space-x-8 overflow-x-auto flex-nowrap scrollbar-hide">
              {[
                { id: "videos", label: "Videos", icon: Play },
                // { id: "collaborations", label: "Collaborations", icon: Users },
                // { id: "tutorials", label: "Tutorials", icon: BookOpen },
                // { id: "community", label: "Community", icon: MessageCircle },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center  space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {videos?.length > 0 ? (              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos?.map((video) => (
                  <Link key={video?.id} to={`/video/${video._id}`}>
                  <div
                    
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden group cursor-pointer"
                  >
                    <div className="relative aspect-video">
                      <img
                        src={video?.thumbnail}
                        alt={video?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                          <Play
                            className="w-6 h-6 text-gray-900 ml-1"
                            fill="currentColor"
                          />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {formatDuration(video?.duration)}
                      </div>
                      
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {video.title}
                      </h4>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{formatNumber(video?.views)}</span>
                          </div>
                          {/* <div className="flex items-center space-x-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{formatNumber(video.likes)}</span>
                          </div> */}
                        </div>
                        <span>
                          {/* {new Date(video.uploadDate).toLocaleDateString()} */}
                        </span>
                      </div>
                    </div>
                  </div>
                  </Link>
                ))}
              </div>
            ):(<h1 className="flex justify-center items-center text-2xl">No Videos Found</h1>)}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
