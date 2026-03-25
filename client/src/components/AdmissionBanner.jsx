import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AdmissionBanner = () => {
  const [settings, setSettings] = useState({
    admission_banner_enabled: 'false',
    admission_banner_text: '🚀 ADMISSION OPEN FOR NEW ACADEMIC SESSION! JOIN NOW! 🚀'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/content?page=global');
        const data = res.data.data;
        const bannerSettings = {};
        data.forEach(item => {
          if (item.section_key === 'admission_banner_enabled' || item.section_key === 'admission_banner_text') {
            bannerSettings[item.section_key] = item.section_value;
          }
        });
        if (Object.keys(bannerSettings).length > 0) {
          setSettings(prev => ({ ...prev, ...bannerSettings }));
        }
      } catch (err) {
        console.error('Error fetching banner settings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (isLoading || settings.admission_banner_enabled !== 'true') return null;

  return (
    <div className="bg-school-accent py-2 overflow-hidden border-b border-yellow-500 shadow-sm transition-all duration-300">
      <div className="whitespace-nowrap flex items-center animate-marquee">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className="text-school-secondary font-bold text-sm md:text-base px-4 uppercase tracking-wider">
            {settings.admission_banner_text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AdmissionBanner;
