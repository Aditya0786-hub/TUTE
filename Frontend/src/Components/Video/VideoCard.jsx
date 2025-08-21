import React, { useState, useRef, useEffect } from 'react';
import { Play, Clock, Eye, Calendar, User, Heart, Share2, Bookmark, MoreHorizontal } from 'lucide-react';

/**
 * VideoCard Component - A modern, unique video card with innovative features
 * 
 * @param {Object} props - Component props
 * @param {Object} props.video - Video data object
 * @param {Function} props.onLike - Callback when video is liked
 * @param {Function} props.onShare - Callback when video is shared
 * @param {Function} props.onBookmark - Callback when video is bookmarked
 */
const VideoCard = ({ 
  video,  
  onLike = () => {}, 
  onShare = () => {}, 
  onBookmark = () => {} 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(video.isLiked || false);
  const [isBookmarked, setIsBookmarked] = useState(video.isBookmarked || false);
  const [showActions, setShowActions] = useState(false);
  const cardRef = useRef(null);

  // Format view count
  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format upload date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };
   
   

  // Handle like toggle
  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike(video.id, !isLiked);
  };

  // Handle bookmark toggle
  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark(video.id, !isBookmarked);
  };

  // Handle share
  const handleShare = (e) => {
    e.stopPropagation();
    onShare(video.id);
  };

  // Handle card click
  

  return (
    <article
      ref={cardRef}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 ease-out transform hover:-translate-y-2 cursor-pointer overflow-hidden border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Play video: ${video.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={video.thumbnail}
          alt={`${video.title} thumbnail`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
            <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-lg flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{Number(video.duration).toFixed(2)}</span>
        </div>

        {/* Quality Badge */}
        {/* {video.quality && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md">
            {video.quality}
          </div>
        )} */}

        {/* Quick Actions */}
        <div className={`absolute top-3 right-3 flex space-x-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <button
            onClick={handleLike}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-700 hover:bg-red-50 hover:text-red-500'
            }`}
            aria-label={isLiked ? 'Unlike video' : 'Like video'}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isBookmarked 
                ? 'bg-blue-500 text-white' 
                : 'bg-white/90 text-gray-700 hover:bg-blue-50 hover:text-blue-500'
            }`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark video'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Creator Info */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="relative">
            <img
              src={video.owner.avatar}
              alt={`${video.owner.name} avatar`}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
            />
            {/* {video.creator.verified && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )} */}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate hover:text-blue-600 transition-colors duration-200">
              {video.owner.username}
            </h3>
            {/* <p className="text-xs text-gray-500">{video.owner.subscribers} subscribers</p> */}
          </div>
        </div>

        {/* Video Title */}
        <h2 className="font-bold text-gray-900 text-lg leading-tight mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {video.title}
        </h2>

        {/* Video Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{formatViews(video.views)} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(video.createdAt)}</span>
            </div>
          </div>
        </div>

        
        
        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 text-sm transition-colors duration-200 ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
              aria-label={isLiked ? 'Unlike video' : 'Like video'}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{formatViews(video.likes + (isLiked ? 1 : 0))}</span>
            </button>
            
          </div>

        </div>
      </div>

      {/* Progress Bar (if video has been watched) */}
      {/* {video.watchProgress && video.watchProgress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
          <div
            className="h-full bg-red-500 transition-all duration-300"
            style={{ width: `${video.watchProgress}%` }}
          />
        </div>
      )} */}
    </article>
  );
};

export default VideoCard;