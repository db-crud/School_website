import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Download, Search, Home as HomeIcon, FileText, Printer, Eye } from 'lucide-react';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get('/notices');
        if (res.data.success) {
          setNotices(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching notices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const filteredNotices = notices.filter(n => {
    const searchVal = searchTerm.toLowerCase();
    const contentVal = n.content?.toLowerCase() || '';
    const titleVal = n.title?.toLowerCase() || '';
    
    const matchesSearch = titleVal.includes(searchVal) || contentVal.includes(searchVal);
    const matchesType = searchType === '' || n.type === searchType;
    
    let matchesDate = true;
    if (fromDate || toDate) {
      const noticeDate = new Date(n.date).setHours(0,0,0,0);
      const from = fromDate ? new Date(fromDate).setHours(0,0,0,0) : -8640000000000000;
      const to = toDate ? new Date(toDate).setHours(23,59,59,999) : 8640000000000000;
      matchesDate = noticeDate >= from && noticeDate <= to;
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

  const uniqueTypes = [...new Set(notices.map(n => n.type))];

  const handleDownload = async (url) => {
    if (!url) return;
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
    if (!url) return;
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => printWindow.print(), 500);
      };
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6 bg-white p-3 rounded-lg shadow-sm">
           <HomeIcon size={16} className="mr-2 text-school-primary" />
           <span>/</span>
           <span className="ml-2 font-medium">Notice/News</span>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
           <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="col-span-1">
                 <select 
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-school-primary outline-none"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                 >
                    <option value="">--Select Type--</option>
                    {uniqueTypes.map(type => (
                       <option key={type} value={type}>{type}</option>
                    ))}
                 </select>
              </div>
              <div className="col-span-1 lg:col-span-2">
                 <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search title..." 
                      className="w-full border border-gray-200 rounded-lg pl-10 pr-4 p-2.5 text-sm focus:ring-1 focus:ring-school-primary outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 </div>
              </div>
              <div className="col-span-1">
                 <input 
                    type="date" 
                    title="From Date"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-school-primary outline-none" 
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                 />
              </div>
              <div className="col-span-1">
                 <input 
                    type="date" 
                    title="To Date"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-school-primary outline-none" 
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                 />
              </div>
              <div className="col-span-1 flex gap-2">
                 <button 
                    onClick={() => {
                      setSearchTerm('');
                      setSearchType('');
                      setFromDate('');
                      setToDate('');
                    }}
                    className="bg-gray-200 text-gray-700 w-full p-2 rounded-lg font-bold hover:bg-gray-300 transition-colors" 
                    title="Reset Filters"
                 >
                    Reset Alerts
                 </button>
              </div>
           </div>
        </div>

        {/* Notices Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-sm font-bold text-gray-700 w-16">S.N.</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700">Notice Title</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700 w-32">Type</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700 w-40">Published Date</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700 w-40 text-center">Action</th>
                 </tr>
              </thead>
              <tbody>
                 {loading ? (
                    <tr>
                       <td colSpan="5" className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center">
                             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-school-primary mb-4"></div>
                             <p className="text-gray-500 italic text-sm">Loading notices...</p>
                          </div>
                       </td>
                    </tr>
                 ) : filteredNotices.length > 0 ? (
                    filteredNotices.map((notice, index) => {
                       const isNew = (new Date() - new Date(notice.date)) / (1000 * 60 * 60 * 24) < 7;
                       return (
                          <tr key={notice.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                             <td className="px-6 py-4 text-sm text-gray-600 font-medium">{index + 1}.</td>
                             <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                   <a 
                                     href={notice.attachment_url || '#'} 
                                     target="_blank" 
                                     rel="noopener noreferrer"
                                     className="text-sm font-bold text-gray-800 hover:text-school-primary transition-colors leading-tight"
                                   >
                                      {notice.title}
                                   </a>
                                   {isNew && (
                                      <span className="inline-flex items-center text-[10px] text-red-600 font-black uppercase tracking-tighter animation-blink">
                                         <span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span> New
                                      </span>
                                   )}
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <span className="bg-school-light text-school-primary px-3 py-1 rounded-md text-[11px] font-bold uppercase border border-school-primary/10">
                                   {notice.type}
                                </span>
                             </td>
                             <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                {new Date(notice.date).toLocaleDateString('ne-NP') || notice.date}
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-2">
                                   <a 
                                     href={notice.attachment_url || '#'} 
                                     target="_blank" 
                                     rel="noopener noreferrer"
                                     className={`p-2 rounded transition-colors ${notice.attachment_url ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 text-gray-400 pointer-events-none'}`}
                                     title="View File"
                                   >
                                      <Eye size={16} />
                                   </a>
                                   <button 
                                     onClick={() => handleDownload(notice.attachment_url)}
                                     disabled={!notice.attachment_url}
                                     className={`p-2 rounded transition-colors ${notice.attachment_url ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                     title="Download"
                                   >
                                      <Download size={16} />
                                   </button>
                                   <button 
                                     onClick={() => handlePrint(notice.attachment_url)}
                                     disabled={!notice.attachment_url}
                                     className={`p-2 rounded transition-colors ${notice.attachment_url ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                     title="Print"
                                   >
                                      <Printer size={16} />
                                   </button>
                                </div>
                             </td>
                          </tr>
                       );
                    })
                 ) : (
                    <tr>
                       <td colSpan="5" className="px-6 py-20 text-center text-gray-400 italic text-sm">
                          No notices found matching your criteria.
                       </td>
                    </tr>
                 )}
              </tbody>
           </table>
        </div>

        {/* CSS for blinking effect */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
          }
          .animation-blink {
            animation: blink 1s infinite;
          }
        `}} />
      </div>
    </div>
  );
};

export default Notices;
