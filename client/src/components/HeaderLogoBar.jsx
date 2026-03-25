import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { GraduationCap } from 'lucide-react';
import api from '../utils/api';

const HeaderLogoBar = () => {
  const logoExists = true;

  const [messages, setMessages] = useState({
    header_message_en: 'Hamro Gyanodaya Clean Gyanodaya',
    header_message_np: 'हाम्रो ज्ञानोदय स्वच्छ ज्ञानोदय'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/content?page=global');
        const data = res.data.data;
        const newMessages = {};
        data.forEach(item => {
          if (item.section_key === 'header_message_en' || item.section_key === 'header_message_np') {
            newMessages[item.section_key] = item.section_value;
          }
        });
        if (Object.keys(newMessages).length > 0) {
          setMessages(prev => ({ ...prev, ...newMessages }));
        }
      } catch (err) {
        console.error('Error fetching header messages:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="bg-white py-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 md:h-24 md:w-24 flex-shrink-0">
              {logoExists ? (
                <img src={logo} alt="School Logo" className="h-full w-full object-contain" />
              ) : (
                <div className="h-full w-full bg-school-light rounded-full flex items-center justify-center">
                  <GraduationCap className="h-12 w-12 text-school-primary" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-red-600 font-bold text-sm uppercase tracking-wide"></span>
              <h1 className="text-xl md:text-3xl font-black text-school-primary leading-tight">
                GYANODAYA MODEL SECONDARY SCHOOL
              </h1>
              <span className="text-gray-500 font-bold text-sm">Khajura-3, Banke, Nepal</span>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end text-right">
             <h3 className="text-lg md:text-xl font-bold text-school-primary uppercase tracking-wide">{messages.header_message_en}</h3>
             <h3 className="text-md md:text-lg font-bold text-red-600">{messages.header_message_np}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderLogoBar;
