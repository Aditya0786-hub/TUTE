import React, { useState, useEffect, useRef } from "react";
import VideoCard from "./VideoCard";
import {
  Search,
  Filter,
  Grid,
  List,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setloading, setVideoData } from "../../Features/Video/video.slice";
import { VideoService } from "../../Features/Video/video.service";
import { Link } from "react-router-dom";

/**
 * VideoGrid Component - A responsive grid layout for video cards with filtering and sorting
 */
const VideoGrid = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid");

  const gridRef = useRef(null);

  //Api to fetch all video data
  const video = useSelector((state) => state.video.VideoData);
  const loading = useSelector((state) => state.video.loading);
  console.log(loading);
  const dispatch = useDispatch();

  const fetchVideo = async () => {
    try {
      dispatch(setloading(true));
      const res = await VideoService.getAllVideos();
      dispatch(setVideoData(res.data.data.docs));
      dispatch(setloading(false));
      setVideos(res.data.data.docs);
      setFilteredVideos(res.data.data.docs);
      console.log(res.data.data);
    } catch (error) {
      dispatch(setloading(false));
      console.log(error.data?.message || "Video not fetched");
    }
  };

  // Initialize videos
  useEffect(() => {
    fetchVideo();
  }, []);

  // Filter and sort videos
  useEffect(() => {
    let filtered = videos.filter(
      (video) =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // Sort videos
    switch (sortBy) {
      case "recent":
        filtered.sort(
          (a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)
        );
        break;
      case "popular":
        filtered.sort((a, b) => b.views - a.views);
        break;
      case "liked":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      default:
        break;
    }

    setFilteredVideos(filtered);
  }, [videos, searchQuery, sortBy]);

  // Handle video actions
  // const handlePlay = (videoId) => {
  //   console.log('Playing video:', videoId);
  //   // Implement video play logic
  // };

  const handleLike = (videoId, isLiked) => {
    setVideos((prev) =>
      prev.map((video) =>
        video.id === videoId
          ? { ...video, isLiked, likes: video.likes + (isLiked ? 1 : -1) }
          : video
      )
    );
  };

  const handleBookmark = (videoId, isBookmarked) => {
    setVideos((prev) =>
      prev.map((video) =>
        video.id === videoId ? { ...video, isBookmarked } : video
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Loading skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4">
                  <div className="aspect-video bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Videos
          </h1>
          <p className="text-gray-600">
            Explore curated content from top creators
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search videos, creators, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="liked">Most Liked</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                aria-label="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredVideos.length} video
            {filteredVideos.length !== 1 ? "s" : ""} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Video Grid */}
        <div
          ref={gridRef}
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1 max-w-4xl mx-auto"
          }`}
        >
          {filteredVideos.map((video) => (
            <Link key={video._id} to={`/video/${video._id}`}>
              <VideoCard
                key={video._id}
                video={video}
                onLike={handleLike}
                onBookmark={handleBookmark}
              />
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredVideos.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No videos found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or browse our trending content
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGrid;
