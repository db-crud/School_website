import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Download, Printer } from 'lucide-react';
import api from '../utils/api';

const PopupNotice = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [notice, setNotice] = useState({
    popup_notice_enabled: 'false',
    popup_notice_image: '',
    popup_notice_link: ''
  });

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await api.get('/content?page=global');
        const data = res.data.data;
        const noticeData = {};
        data.forEach(item => {
          if (item.section_key.startsWith('popup_notice_')) {
            noticeData[item.section_key] = item.section_value;
          }
        });

        if (noticeData.popup_notice_enabled === 'true') {
          setNotice(noticeData);
          setIsVisible(true);
        }
      } catch (err) {
        console.error('Error fetching popup notice:', err);
      }
    };
    fetchNotice();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleDownload = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const filename = url.split('/').pop() || 'notice-download';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed, opening in new tab', error);
      window.open(url, '_blank');
    }
  };

  const handlePrint = (url) => {
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => printWindow.print(), 500);
      };
    }
  };

  if (!isVisible || !notice.popup_notice_image) return null;

  const isPdf = notice.popup_notice_image.toLowerCase().includes('.pdf');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl overflow-hidden max-w-6xl w-[95%] shadow-2xl relative animate-in zoom-in slide-in-from-bottom-8 duration-500 border border-gray-100 flex flex-col">
        
        {/* Banner Header */}
        <div className="bg-school-primary py-5 px-6 border-b border-white/10 flex-shrink-0 relative">
           <div className="flex flex-col items-center justify-center text-center w-full px-12">
              <div className="flex items-center gap-2 mb-2">
                 <span className="w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(248,113,113,0.8)]"></span>
                 <span className="text-white/90 text-[11px] font-bold uppercase tracking-[0.3em] drop-shadow-sm">Latest Notice</span>
              </div>
              {notice.popup_notice_title && (
                 <h2 className="text-white text-2xl md:text-3xl font-black drop-shadow-md tracking-tight leading-tight">
                    {notice.popup_notice_title}
                 </h2>
              )}
           </div>
           
           <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
              {notice.popup_notice_link && (
                 <a 
                   href={notice.popup_notice_link} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="hidden sm:flex items-center gap-1.5 text-white hover:text-school-primary hover:bg-white text-xs font-black border-2 border-white px-4 py-1.5 rounded-full transition-all shadow-sm"
                 >
                   <ExternalLink size={14} strokeWidth={3} /> Details
                 </a>
              )}
              <button 
                onClick={handleClose}
                className="text-white/90 hover:text-white transition-all bg-black/20 hover:bg-black/40 p-2 rounded-full backdrop-blur-sm shadow-sm"
                title="Close"
              >
                <X size={20} strokeWidth={3} />
              </button>
           </div>
        </div>

        {!isPdf && (
           <div className="bg-gray-100 py-3 border-b border-gray-200 flex justify-center gap-4">
              <button onClick={() => handleDownload(notice.popup_notice_image)} className="flex items-center gap-2 bg-white px-5 py-2 rounded-lg text-sm font-bold text-gray-700 shadow-sm border border-gray-200 hover:bg-school-primary hover:text-white hover:border-school-primary transition-colors">
                 <Download size={16} /> Download Image
              </button>
              <button onClick={() => handlePrint(notice.popup_notice_image)} className="flex items-center gap-2 bg-white px-5 py-2 rounded-lg text-sm font-bold text-gray-700 shadow-sm border border-gray-200 hover:bg-school-primary hover:text-white hover:border-school-primary transition-colors">
                 <Printer size={16} /> Print Image
              </button>
           </div>
        )}

        <div className="p-6 md:p-10 bg-gray-50 flex-grow">
          <div className={`overflow-hidden bg-white flex justify-center items-center rounded-2xl shadow-inner border-2 border-gray-200 relative ${isPdf ? 'h-[75vh]' : 'h-[60vh]'} w-full`}>
            {isPdf ? (
               <iframe 
                  src={`${notice.popup_notice_image}#navpanes=1&toolbar=1&view=FitH`} 
                  className="absolute inset-0 w-full h-full border-none" 
                  title="Important Notice PDF"
               ></iframe>
            ) : notice.popup_notice_link ? (
               <a href={notice.popup_notice_link} target="_blank" rel="noopener noreferrer" className="w-full h-full flex justify-center items-center text-center p-4">
                  <img 
                    src={notice.popup_notice_image} 
                    alt="Important Notice" 
                    className="max-w-full max-h-full object-contain mx-auto hover:scale-[1.02] transition-transform duration-300 cursor-pointer drop-shadow-sm"
                  />
               </a>
            ) : (
               <img 
                 src={notice.popup_notice_image} 
                 alt="Important Notice" 
                 className="max-w-full max-h-full object-contain mx-auto p-4 drop-shadow-sm"
               />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupNotice;
