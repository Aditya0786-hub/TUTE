import React, { useEffect, useState } from 'react';
import { Users, Bell, BellOff, Play, Calendar, CheckCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { SubscriptionService } from '../Features/Subscriber/subscriber.service';
import { ChannelCard } from './ChannelCard';

const SubscriptionPage = () => {

   const [channels,setChannels] = useState(null)

    useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await SubscriptionService.getSubscribedChannels(); // example username
        console.log(res)
        setChannels(res.data.data)
      } catch (err) {
        console.error(err);
      }
    };
    fetchChannels();
  }, []);
  

  return (
    <div className="subscription-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">My Subscriptions</h1>
          <p className="page-subtitle">Stay updated with your favorite channels</p>
        </div>
        
        <div className="stats-summary">
          <div className="stat-card">
            <Users size={20} />
            <div>
              <span className="stat-number">230</span>
              <span className="stat-label">Subscriptions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Channels Grid */}
      <div className="channels-grid">
        {channels?.map(channel => (
          <ChannelCard
            key={channel.id}
            channel={channel}
          />
        ))}
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .subscription-page {
          min-height: 100vh;
          background-color: #fafafa;
          padding: 2rem 1rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .page-header {
          max-width: 1200px;
          margin: 0 auto 3rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
        }

        .header-content h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .header-content p {
          color: #666;
          font-size: 1.1rem;
        }

        .stats-summary {
          display: flex;
          gap: 1rem;
        }

        .stat-card {
          background: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 120px;
        }

        .stat-card.live {
          background: linear-gradient(135deg, #ff4757, #ff3742);
          color: white;
        }

        .stat-number {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1;
        }

        .stat-label {
          display: block;
          font-size: 0.875rem;
          opacity: 0.8;
        }

        .channels-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .channel-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .channel-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .avatar-container {
          position: relative;
          margin-bottom: 1rem;
        }

        .channel-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #f0f0f0;
        }

        .live-indicator {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ff4757;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .live-dot {
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .channel-info {
          flex: 1;
        }

        .channel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .channel-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .verified-icon {
          color: #1da1f2;
        }

        .notification-btn {
          background: none;
          border: none;
          padding: 0.5rem;
          border-radius: 8px;
          cursor: pointer;
          color: #666;
          transition: all 0.2s ease;
        }

        .notification-btn:hover {
          background: #f0f0f0;
          color: #1a1a1a;
        }

        .notification-btn.active {
          color: #1da1f2;
          background: #e3f2fd;
        }

        .channel-stats {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #666;
          font-size: 0.875rem;
        }

        .channel-description {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.4;
          margin-bottom: 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .latest-video {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #888;
          font-size: 0.8rem;
        }

        .hover-actions {
          position: absolute;
          bottom: 1.5rem;
          right: 1.5rem;
          display: flex;
          gap: 0.5rem;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
        }

        .channel-card:hover .hover-actions {
          opacity: 1;
          transform: translateY(0);
        }

        .action-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn.primary {
          background: #1a1a1a;
          color: white;
        }

        .action-btn.primary:hover {
          background: #333;
        }

        .action-btn.secondary {
          background: #f0f0f0;
          color: #666;
        }

        .action-btn.secondary:hover {
          background: #e0e0e0;
          color: #1a1a1a;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .subscription-page {
            padding: 1rem 0.5rem;
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1.5rem;
          }

          .header-content h1 {
            font-size: 2rem;
          }

          .stats-summary {
            justify-content: space-between;
          }

          .stat-card {
            flex: 1;
            min-width: auto;
            padding: 0.75rem 1rem;
          }

          .channels-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .channel-card {
            padding: 1rem;
          }

          .hover-actions {
            position: static;
            opacity: 1;
            transform: none;
            margin-top: 1rem;
            justify-content: flex-end;
          }
        }

        @media (max-width: 480px) {
          .stats-summary {
            flex-direction: column;
          }

          .stat-card {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default SubscriptionPage;