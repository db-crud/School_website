import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { Plus, Trash2, Edit2, User, Upload, GripVertical, Check, X } from 'lucide-react';

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', subject: '', qualification: '', contact_number: '' });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Tracking Edit Mode
  const [editingId, setEditingId] = useState(null);
  const [tempPhotoUrl, setTempPhotoUrl] = useState('');

  // Drag and Drop Refs
  const dragItem = useRef();
  const dragOverItem = useRef();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/teachers');
      // Sort teachers by display_order on the client side just in case, though backend sorts them
      const sorted = res.data.data.sort((a, b) => a.display_order - b.display_order);
      setTeachers(sorted);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let uploadedUrl = tempPhotoUrl;
      if (imageFile) {
        const fileData = new FormData();
        fileData.append('file', imageFile);
        const uploadRes = await api.post('/upload', fileData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (uploadRes.data.success) {
          uploadedUrl = uploadRes.data.url;
        }
      }

      if (editingId) {
        const finalData = { ...formData, photo_url: uploadedUrl, display_order: teachers.find(t => t.id === editingId)?.display_order || 0 };
        await api.put(`/teachers/${editingId}`, finalData);
      } else {
        const nextOrder = teachers.length > 0 ? Math.max(...teachers.map(t => t.display_order)) + 1 : 0;
        const finalData = { ...formData, photo_url: uploadedUrl, display_order: nextOrder };
        await api.post('/teachers', finalData);
      }

      resetForm();
      fetchTeachers();
    } catch (err) { 
      console.error(err); 
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this teacher profile?')) {
      try {
        await api.delete(`/teachers/${id}`);
        fetchTeachers();
      } catch (err) { console.error(err); }
    }
  };

  const handleEdit = (teacher) => {
    setEditingId(teacher.id);
    setFormData({
      name: teacher.name,
      subject: teacher.subject,
      qualification: teacher.qualification,
      contact_number: teacher.contact_number || ''
    });
    setTempPhotoUrl(teacher.photo_url || '');
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTempPhotoUrl('');
    setImageFile(null);
    setFormData({ name: '', subject: '', qualification: '', contact_number: '' });
  };

  // Drag and Drop handlers
  const onDragStart = (e, index) => {
    dragItem.current = index;
    // Keep standard HTML5 drag behavior working
    if(e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        // Need to set data to enable drag in some browsers like Firefox
        e.dataTransfer.setData('text/html', e.target.parentNode);
    }
  };

  const onDragEnter = (e, index) => {
    dragOverItem.current = index;
  };

  const onDragEnd = async () => {
    if (dragItem.current === dragOverItem.current || dragOverItem.current === null || dragOverItem.current === undefined) {
       return;
    }
    
    const _teachers = [...teachers];
    const draggedItemContent = _teachers.splice(dragItem.current, 1)[0];
    _teachers.splice(dragOverItem.current, 0, draggedItemContent);
    
    dragItem.current = null;
    dragOverItem.current = null;
    
    // Update local state immediately for fast feedback
    setTeachers(_teachers);
    
    // Prepare updates
    const updates = _teachers.map((t, index) => ({ id: t.id, display_order: index }));
    
    try {
       await api.put('/teachers/reorder', { updates });
    } catch (e) {
       console.error("Failed to reorder", e);
       fetchTeachers(); // revert on fail
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Form Section */}
      <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-xl font-bold flex items-center gap-3">
             {editingId ? <Edit2 className="text-school-accent" /> : <Plus className="text-school-primary" />} 
             {editingId ? 'Edit Teacher Profile' : 'Add Teacher Profile'}
           </h3>
           {editingId && (
             <button type="button" onClick={resetForm} className="text-gray-400 hover:text-red-500 flex items-center gap-1 text-sm font-bold bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                <X size={16} /> Cancel Edit
             </button>
           )}
        </div>
        <form onSubmit={handleCreateOrUpdate} className="flex flex-col md:flex-row gap-8">
          {/* Left: Photo Upload */}
          <div className="md:w-1/3 flex flex-col gap-4">
            <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-3xl flex items-center justify-center relative bg-gray-50 overflow-hidden hover:border-school-primary transition-colors">
               {imageFile ? (
                  <img src={URL.createObjectURL(imageFile)} className="w-full h-full object-cover" alt="Preview" />
               ) : tempPhotoUrl ? (
                  <img src={tempPhotoUrl} className="w-full h-full object-cover opacity-80" alt="Current" />
               ) : (
                  <div className="text-center text-gray-400">
                     <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                     <span className="font-semibold text-sm">Upload Photo</span>
                  </div>
               )}
               <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
            <p className="text-xs text-center text-gray-500 italic">Click to browse or drag image here</p>
          </div>

          {/* Right: Form Fields */}
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input className="p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-school-primary" placeholder="Teacher Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input className="p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-school-primary" placeholder="Designation" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
            <input className="p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-school-primary sm:col-span-2" placeholder="Qualification" required value={formData.qualification} onChange={(e) => setFormData({...formData, qualification: e.target.value})} />
            <input className="p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-school-primary sm:col-span-2" placeholder="Contact number" value={formData.contact_number} onChange={(e) => setFormData({...formData, contact_number: e.target.value})} />
            
            <button disabled={uploading} className={`sm:col-span-2 py-4 mt-2 disabled:opacity-70 font-bold rounded-2xl text-white ${editingId ? 'bg-school-accent hover:bg-yellow-500' : 'btn-primary'}`}>
              {uploading ? 'Saving Profile...' : (editingId ? 'Update Teacher Profile' : 'Save Teacher Profile')}
            </button>
          </div>
        </form>
      </div>

      {/* Downward List Section */}
      <div className="flex items-center gap-2 ml-2 mb-2">
         <GripVertical size={20} className="text-gray-400" />
         <h3 className="text-lg font-bold text-gray-700">Drag to Reorder</h3>
      </div>
      <div className="flex flex-col gap-4">
        {teachers.map((teacher, index) => (
          <div 
            key={teacher.id} 
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragEnter={(e) => onDragEnter(e, index)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => e.preventDefault()}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-6 group hover:border-school-primary transition-colors cursor-move"
          >
             <div className="text-gray-300 px-2 cursor-grab active:cursor-grabbing">
                <GripVertical size={24} />
             </div>
             <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 flex items-center justify-center">
                {teacher.photo_url ? (
                   <img src={teacher.photo_url} alt={teacher.name} className="w-full h-full object-cover" />
                ) : (
                   <span className="text-[10px] font-black tracking-wider text-gray-400 -rotate-12 select-none">NO PHOTO</span>
                )}
             </div>
             <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden">
                <div className="flex flex-col">
                   <h4 className="font-bold text-gray-900 truncate text-lg">{teacher.name}</h4>
                   <p className="text-school-primary text-xs font-bold uppercase">{teacher.subject}</p>
                </div>
                <div className="flex flex-col md:items-end text-sm text-gray-500">
                   <p className="truncate">{teacher.qualification}</p>
                   {teacher.contact_number && <p className="text-gray-400 text-xs text-left md:text-right">📞 {teacher.contact_number}</p>}
                </div>
             </div>
             <div className="flex items-center gap-2 pr-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(teacher)} 
                  className="p-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                  title="Edit Teacher"
                >
                   <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(teacher.id)} 
                  className="p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                  title="Delete Teacher"
                >
                   <Trash2 size={18} />
                </button>
             </div>
          </div>
        ))}
        {teachers.length === 0 && !loading && (
           <div className="text-center p-10 bg-gray-50 rounded-3xl border border-dashed border-gray-300 text-gray-400 italic">
               No teachers added yet.
           </div>
        )}
      </div>
    </div>
  );
};

export default ManageTeachers;
