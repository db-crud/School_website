import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Trash2, Check, Mail, User, Calendar, MessageSquare } from 'lucide-react';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/contact');
      setMessages(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/contact/${id}/read`);
      fetchMessages();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this message?')) {
      try {
        await api.delete(`/contact/${id}`);
        fetchMessages();
      } catch (err) { console.error(err); }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {messages.map(msg => (
          <div key={msg.id} className={`bg-white p-8 rounded-[35px] border transition-all ${msg.is_read ? 'opacity-70 border-gray-100' : 'border-school-accent border-2 shadow-xl scale-[1.02]'}`}>
             <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                   <div className={`p-4 rounded-2xl ${msg.is_read ? 'bg-gray-100 text-gray-400' : 'bg-school-light text-school-primary'}`}>
                      <MessageSquare size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-gray-900 text-lg">{msg.name}</h4>
                      <p className="text-gray-400 text-xs italic">{msg.email}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
                      <Calendar size={12} /> {new Date(msg.created_at).toLocaleDateString()}
                   </p>
                   {!msg.is_read && <span className="text-[10px] bg-school-accent text-school-secondary px-2 py-1 rounded-full font-bold">NEW</span>}
                </div>
             </div>
             
             <div className="mb-8">
                <p className="text-school-primary font-bold text-sm mb-2 uppercase tracking-wide">Subject: {msg.subject || 'No Subject'}</p>
                <div className="bg-gray-50 p-6 rounded-2xl text-gray-600 italic leading-relaxed text-sm">
                   "{msg.message}"
                </div>
             </div>

             <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                {!msg.is_read && (
                  <button onClick={() => markAsRead(msg.id)} className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl font-bold text-xs hover:bg-green-100 transition-all">
                     <Check size={16} /> Mark Read
                  </button>
                )}
                <button onClick={() => handleDelete(msg.id)} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition-all">
                   <Trash2 size={16} /> Delete
                </button>
             </div>
          </div>
        ))}
      </div>
      
      {messages.length === 0 && !loading && (
        <div className="text-center py-20 italic text-gray-400">No messages found.</div>
      )}
    </div>
  );
};

export default ManageMessages;
