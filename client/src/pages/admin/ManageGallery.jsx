import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Trash2, ImageIcon, Image as LucideImage, Loader2, Upload } from 'lucide-react';

const ManageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ title: '', image_url: '', category: 'General' });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await api.get('/gallery');
      setImages(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.image_url) {
      alert('Please upload an image first!');
      return;
    }
    try {
      await api.post('/gallery', formData);
      setFormData({ title: '', image_url: '', category: 'General' });
      fetchGallery();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this image from gallery?')) {
      try {
        await api.delete(`/gallery/${id}`);
        fetchGallery();
      } catch (err) { console.error(err); }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB!');
      return;
    }

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await api.post('/upload', uploadData);
      setFormData(prev => ({ ...prev, image_url: res.data.url }));
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Plus className="text-school-primary" /> Upload to Gallery
        </h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <input className="p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-school-primary" placeholder="Image Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          
          <div className="relative flex items-center p-2 rounded-2xl bg-gray-50 outline-none focus-within:ring-2 focus-within:ring-school-primary h-[56px]">
             {uploading ? (
                <div className="flex items-center gap-2 px-2 text-school-primary w-full justify-center">
                   <Loader2 className="animate-spin" size={20} /> <span className="text-sm font-bold">Uploading...</span>
                </div>
             ) : formData.image_url ? (
                <div className="flex items-center justify-between w-full px-4 border-2 border-green-200 bg-green-50 rounded-xl h-full">
                   <span className="text-sm text-green-700 font-bold truncate pr-2 flex items-center gap-2"><ImageIcon size={16}/> Uploaded</span>
                   <button type="button" onClick={() => setFormData({...formData, image_url: ''})} className="text-red-500 text-xs font-bold hover:underline">Remove</button>
                </div>
             ) : (
                <label className="cursor-pointer flex items-center gap-2 text-gray-500 hover:text-school-primary font-bold w-full h-full px-2 text-sm justify-center bg-white border border-gray-200 rounded-xl shadow-sm transition-all hover:border-school-primary">
                   <Upload size={18} /> Click to Upload Photo
                   <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
             )}
          </div>

          <select className="p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-school-primary" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
            <option>General</option>
            <option>Exam</option>
            <option>Holiday</option>
            <option>Sports</option>
            <option>Cultural</option>
            <option>Building</option>
            <option>Hero Slider</option>
            <option>Welcome Section</option>
            <option>About Us</option>
            <option>Principal</option>
          </select>
          <button className="btn-primary lg:col-span-3 py-4">Add to Gallery</button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map(img => (
          <div key={img.id} className="relative group overflow-hidden rounded-[30px] aspect-video border-4 border-white shadow-lg">
             <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-6 text-center">
                <h4 className="text-white font-bold mb-1">{img.title || 'Untitled'}</h4>
                <p className="text-school-accent text-xs font-bold uppercase mb-4">{img.category}</p>
                <button onClick={() => handleDelete(img.id)} className="bg-red-500 text-white p-3 rounded-2xl hover:bg-red-600 transition-colors">
                   <Trash2 size={20} />
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageGallery;
