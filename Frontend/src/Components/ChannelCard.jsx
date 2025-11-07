import React,{useState} from "react";
import { Users, Bell, BellOff, Play, Calendar, CheckCircle } from 'lucide-react';
import {  useNavigate } from "react-router-dom";




export const ChannelCard = ({ channel }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate()
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };
   
  const visitChannel = (username)=>{
   
    navigate(`/profile/${username}`)
  }
  

  return (
    <div 
      className="channel-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Channel Avatar */}
      <div className="avatar-container">
        <img
          src={channel.avatar}
          alt={`${channel.name} avatar`}
          className="channel-avatar"
        />
      </div>

      {/* Channel Information */}
      <div className="channel-info">
        <div className="channel-header">
          <h3 className="channel-name">
            {channel?.username}
          </h3>
        </div>

        <div className="channel-stats">
          <div className="stat-item">
            <Users size={14} />
            <span>50m subscribers</span>
          </div>
          <div className="stat-item">
            <Play size={14} />
            <span>20 videos</span>
          </div>
        </div>

        <p className="channel-description">This needs working with one more aggreagation pipeline</p>

        
          <div className="latest-video">
            <Calendar size={14} />
            <span>Latest: 20</span>
          </div>
       
      </div>

      {/* Hover Actions */}
      {isHovered && (
        <div className="hover-actions">
          <button onClick={()=>visitChannel(channel?.username)} className="action-btn primary">
            Visit Channel
          </button>
          <button className="action-btn secondary">
            Unsubscribe
          </button>
        </div>
      )}
    </div>
  );
};