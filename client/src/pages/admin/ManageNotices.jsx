import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { Plus, Trash2, Edit2, Check, X, Bell, Upload, File, Image as ImageIcon, Loader2, MoreVertical, Settings as SettingsIcon, ToggleLeft, ToggleRight } from 'lucide-react';

const ManageNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    content: '', 
    date: '', 
    type: 'General', 
    attachment_url: '',
    is_popup: false 
  });
  const [popupSettings, setPopupSettings] = useState({ enabled: false, imageUrl: '' });
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchNotices();
    fetchPopupSettings();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setActiveMenu(null);
    }
  };

  const fetchNotices = async () => {
    try {
      const res = await api.get('/notices');
      setNotices(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchPopupSettings = async () => {
    try {
      const res = await api.get('/content?page=global');
      const data = res.data.data;
      const enabled = data.find(i => i.section_key === 'popup_notice_enabled')?.section_value === 'true';
      const imageUrl = data.find(i => i.section_key === 'popup_notice_image')?.section_value || '';
      setPopupSettings({ enabled, imageUrl });
    } catch (err) { console.error('Error fetching popup settings:', err); }
  };

  const syncPopupWithSelection = async (finalUrl, shouldBePopup, title) => {
    if (!finalUrl && shouldBePopup) return; // Can't enable popup without file
    
    try {
      if (shouldBePopup) {
         await api.post('/content', { page_name: 'global', section_key: 'popup_notice_image', section_value: finalUrl });
         await api.post('/content', { page_name: 'global', section_key: 'popup_notice_title', section_value: title || '' });
         await api.post('/content', { page_name: 'global', section_key: 'popup_notice_enabled', section_value: 'true' });
         setPopupSettings({ enabled: true, imageUrl: finalUrl });
      } else if (popupSettings.imageUrl === finalUrl) {
         // If it WAS the popup and we are unsetting it, disable it
         await api.post('/content', { page_name: 'global', section_key: 'popup_notice_enabled', section_value: 'false' });
         setPopupSettings(prev => ({ ...prev, enabled: false }));
      }
    } catch (err) { console.error('Error syncing popup state:', err); }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG, PNG and PDF files are allowed!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB!');
      return;
    }

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await api.post('/upload', uploadData);
      setFormData(prev => ({ ...prev, attachment_url: res.data.url }));
    } catch (err) {
      console.error('Upload error detail:', err.response?.data || err);
      const serverMsg = err.response?.data?.message || err.message;
      const status = err.response?.status ? `[${err.response.status}] ` : '';
      alert(`Upload failed: ${status}${serverMsg}`);
    } finally {
      setUploading(false);
    }
  };

  const onDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (formData.is_popup && !formData.attachment_url) {
      alert('You must upload an image or PDF to set this as a Pop-up Notice!');
      return;
    }

    try {
      await api.post('/notices', formData);
      await syncPopupWithSelection(formData.attachment_url, formData.is_popup, formData.title);
      setFormData({ title: '', content: '', date: '', type: 'General', attachment_url: '', is_popup: false });
      fetchNotices();
    } catch (err) { console.error(err); }
  };

  const handleUpdate = async (id) => {
    if (formData.is_popup && !formData.attachment_url) {
      alert('You must upload an image or PDF to set this as a Pop-up Notice!');
      return;
    }

    try {
      await api.put(`/notices/${id}`, formData);
      await syncPopupWithSelection(formData.attachment_url, formData.is_popup, formData.title);
      setIsEditing(null);
      setFormData({ title: '', content: '', date: '', type: 'General', attachment_url: '', is_popup: false });
      fetchNotices();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await api.delete(`/notices/${id}`);
        fetchNotices();
        setActiveMenu(null);
      } catch (err) { console.error(err); }
    }
  };

  const startEdit = (notice) => {
    setIsEditing(notice.id);
    const isCurrentPopup = popupSettings.enabled && popupSettings.imageUrl === notice.attachment_url;
    setFormData({ 
      title: notice.title, 
      content: notice.content, 
      date: notice.date.split('T')[0], 
      type: notice.type, 
      attachment_url: notice.attachment_url || '',
      is_popup: isCurrentPopup
    });
    setActiveMenu(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* Create / Edit Notice */}
      <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Bell size={120} className="text-school-primary" />
        </div>
        
        <h3 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-4">
          <div className="bg-school-light p-3 rounded-2xl">
            {isEditing ? <Edit2 className="text-school-primary" size={24} /> : <Plus className="text-school-primary" size={24} />}
          </div>
          {isEditing ? 'Update Notice' : 'Post New Notice'}
        </h3>

        <form onSubmit={(e) => isEditing ? (e.preventDefault(), handleUpdate(isEditing)) : handleCreate(e)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Notice Title</label>
              <input 
                className="w-full p-5 rounded-3xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-school-light transition-all text-gray-700 font-bold" 
                placeholder="News Heading..." 
                required 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Release Date</label>
                <input 
                  type="date" 
                  className="w-full p-5 rounded-3xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-school-light transition-all font-bold text-gray-600" 
                  required 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Category</label>
                <select 
                  className="w-full p-5 rounded-3xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-school-light transition-all font-bold text-gray-600 appearance-none"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option>General</option>
                  <option>Exam</option>
                  <option>Holiday</option>
                  <option>Event</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Description</label>
              <textarea 
                className="w-full p-6 rounded-[35px] bg-gray-50 border-none outline-none focus:ring-4 focus:ring-school-light transition-all text-gray-700 font-medium h-48 resize-none" 
                placeholder="Write full notice details here..." 
                required
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
              ></textarea>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Notice Attachment (Drag & Drop)</label>
              <div 
                onDragEnter={onDrag}
                onDragLeave={onDrag}
                onDragOver={onDrag}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-3 border-dashed rounded-[40px] p-10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer min-h-[250px] ${dragActive ? 'border-school-primary bg-school-light/30' : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-school-light hover:shadow-xl hover:shadow-gray-100'}`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  className="hidden" 
                  accept=".jpg,.jpeg,.png,.pdf"
                />
                
                {uploading ? (
                  <div className="flex flex-col items-center gap-4 animate-pulse">
                    <Loader2 className="text-school-primary animate-spin" size={48} />
                    <p className="text-sm font-black text-gray-500 uppercase tracking-widest">Uploading File...</p>
                  </div>
                ) : formData.attachment_url ? (
                  <div className="flex flex-col items-center w-full h-full gap-4">
                    <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-inner">
                      {formData.attachment_url.toLowerCase().endsWith('.pdf') ? (
                        <iframe 
                          src={`${formData.attachment_url}#toolbar=0&navpanes=0&scrollbar=0`} 
                          className="w-full h-full border-none pointer-events-none"
                          title="PDF Preview"
                        />
                      ) : (
                        <img 
                          src={formData.attachment_url} 
                          alt="Preview" 
                          className="w-full h-full object-contain"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-all flex items-center justify-center group/preview">
                         <div className="opacity-0 group-hover/preview:opacity-100 transition-all transform translate-y-2 group-hover/preview:translate-y-0">
                            <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-school-primary shadow-xl">
                               Click to Change
                            </span>
                         </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-sm font-black text-school-primary uppercase tracking-widest">File Ready!</p>
                      <p className="text-[10px] text-gray-400 max-w-[200px] truncate">{formData.attachment_url.split('/').pop()}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFormData({...formData, attachment_url: ''}); }}
                      className="text-[9px] font-black text-red-500 uppercase tracking-[0.2em] hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-white p-6 rounded-full shadow-lg shadow-gray-200 text-gray-400 group-hover:text-school-primary group-hover:scale-110 transition-all">
                      <Upload size={40} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-gray-800 uppercase tracking-widest mb-1">Drag & Drop File</p>
                      <p className="text-xs text-gray-400 font-bold italic">Supports JPG, PNG, PDF (Max 5MB)</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Form-Integrated Pop-up Control */}
            <div className="bg-school-light/30 p-6 rounded-[30px] border border-school-light flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-school-primary uppercase tracking-widest mb-1">Pop-up Notice</p>
                <p className="text-[10px] text-gray-500 font-bold italic">Show this notice in a pop-up when the site opens?</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({...formData, is_popup: !formData.is_popup})}
                className={`p-1 rounded-full w-14 transition-all duration-300 flex ${formData.is_popup ? 'bg-school-primary justify-end pr-1' : 'bg-gray-200 justify-start pl-1'}`}
              >
                <div className="bg-white w-6 h-6 rounded-full shadow-md" />
              </button>
            </div>
            
            <div className="flex gap-4 pt-2">
              <button className="flex-1 btn-primary py-5 rounded-[25px] flex items-center justify-center gap-3">
                {isEditing ? <Check size={24} /> : <Plus size={24} />}
                <span>{isEditing ? 'Save Changes' : 'Post Notice'}</span>
              </button>
              {isEditing && (
                <button 
                  type="button" 
                  onClick={() => {setIsEditing(null); setFormData({ title: '', content: '', date: '', type: 'General', attachment_url: '', is_popup: false });}}
                  className="bg-gray-100 text-gray-500 px-8 rounded-[25px] font-black uppercase text-xs hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Notice List */}
      <div className="bg-white rounded-[45px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-xl font-black text-gray-800 uppercase tracking-widest">Recent Notices</h3>
          <span className="bg-gray-100 text-gray-400 text-[10px] font-black px-4 py-1 rounded-full">{notices.length} Total</span>
        </div>
        
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-school-primary" size={40} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 font-black uppercase tracking-[0.2em] text-gray-400 text-[10px]">
                <tr>
                  <th className="p-8">Notice Information</th>
                  <th className="p-8">Category</th>
                  <th className="p-8 text-center">Pop-up Status</th>
                  <th className="p-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {notices.map((notice) => {
                  const isCurrentPopup = popupSettings.enabled && popupSettings.imageUrl === notice.attachment_url && notice.attachment_url;
                  
                  return (
                    <tr key={notice.id} className={`group hover:bg-gray-50 transition-all duration-300 ${isCurrentPopup ? 'bg-school-light/20' : ''}`}>
                      <td className="p-8">
                         <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-3xl ${notice.attachment_url ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-300'}`}>
                               {notice.attachment_url?.toLowerCase().endsWith('.pdf') ? <File size={24} /> : <ImageIcon size={24} />}
                            </div>
                            <div>
                               <p className="font-black text-gray-900 leading-tight mb-1">{notice.title}</p>
                               <p className="text-gray-400 text-[11px] font-bold">Published: {new Date(notice.date).toLocaleDateString()}</p>
                            </div>
                         </div>
                      </td>
                      <td className="p-8">
                         <span className="bg-green-50 text-school-primary px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-tight">{notice.type}</span>
                      </td>
                      <td className="p-8 text-center text-[10px] font-black uppercase tracking-widest">
                         {isCurrentPopup ? (
                           <div className="flex flex-col items-center gap-1">
                             <div className="bg-red-500 text-white px-3 py-1 rounded-full shadow-lg shadow-red-100 animate-pulse">Active</div>
                             <span className="text-[8px] text-gray-400 italic">Visible on site load</span>
                           </div>
                         ) : (
                           <span className="text-gray-200">Inactive</span>
                         )}
                      </td>
                      <td className="p-8 text-right relative">
                         <button 
                           onClick={() => setActiveMenu(activeMenu === notice.id ? null : notice.id)}
                           className="p-3 hover:bg-gray-100 rounded-full transition-all"
                         >
                            <MoreVertical size={18} className="text-gray-400" />
                         </button>

                         {activeMenu === notice.id && (
                           <div ref={menuRef} className="absolute right-8 top-16 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 py-2 min-w-[140px] animate-in fade-in duration-200">
                              <button 
                                onClick={() => startEdit(notice)}
                                className="w-full flex items-center gap-3 px-5 py-2.5 text-left text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-school-light hover:text-school-primary transition-all rounded-t-2xl"
                              >
                                <Edit2 size={14} /> Edit
                              </button>
                              <div className="mx-4 border-t border-gray-50"></div>
                              <button 
                                onClick={() => handleDelete(notice.id)}
                                className="w-full flex items-center gap-3 px-5 py-2.5 text-left text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-50 hover:text-red-600 transition-all rounded-b-2xl"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                           </div>
                         )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {notices.length === 0 && !loading && (
          <div className="p-32 text-center text-gray-400 space-y-4">
             <Bell size={64} className="mx-auto opacity-20" />
             <p className="font-black uppercase tracking-widest text-sm">No notices found</p>
             <p className="text-xs font-bold italic">Post your first school notice using the form above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageNotices;
