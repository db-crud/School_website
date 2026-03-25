import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const NoticeBanner = () => {
  const [enabled, setEnabled] = useState(false);
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contentRes = await api.get('/content?page=global');
        const contentData = contentRes.data.data;
        const bannerEnabled = contentData.find(item => item.section_key === 'notice_banner_enabled')?.section_value === 'true';
        setEnabled(bannerEnabled);

        if (bannerEnabled) {
          const noticeRes = await api.get('/notices');
          setNotices(noticeRes.data.data.slice(0, 5)); // Get latest 5 notices
        }
      } catch (err) {
        console.error('Error fetching notice banner data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading || !enabled || notices.length === 0) return null;

  return (
    <div className="bg-school-primary py-2 overflow-hidden border-b border-white/20 shadow-sm transition-all duration-300 relative z-30">
      <div className="whitespace-nowrap flex items-center animate-marquee">
        <div className="flex space-x-12 px-4">
          {notices.map((notice) => (
            <Link key={notice.id} to="/notices" className="text-white font-semibold text-sm hover:text-school-accent transition-colors flex items-center gap-3">
              <span className="bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">New</span>
              {notice.title}
            </Link>
          ))}
          {/* Duplicate for seamless scrolling, if few notices we duplicate more */}
          {notices.map((notice) => (
            <Link key={`dup-${notice.id}`} to="/notices" className="text-white font-semibold text-sm hover:text-school-accent transition-colors flex items-center gap-3">
              <span className="bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">New</span>
              {notice.title}
            </Link>
          ))}
          {/* Third duplicate to ensure wide screens don't run out */}
          {notices.map((notice) => (
            <Link key={`dup2-${notice.id}`} to="/notices" className="text-white font-semibold text-sm hover:text-school-accent transition-colors flex items-center gap-3">
              <span className="bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">New</span>
              {notice.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticeBanner;
