import React, { useState } from 'react';
import api from '../../utils/api';
import { Settings, Lock, Check } from 'lucide-react';

const ManageSettings = () => {
   const [currentPassword, setCurrentPassword] = useState('');
   const [newPassword, setNewPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const [message, setMessage] = useState({ text: '', type: '' });

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
         setMessage({ text: 'New passwords do not match!', type: 'error' });
         return;
      }
      setLoading(true);
      setMessage({ text: '', type: '' });
      try {
         const res = await api.put('/auth/change-password', { currentPassword, newPassword });
         if (res.data.success) {
            setMessage({ text: 'Password changed successfully', type: 'success' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
         }
      } catch (err) {
         setMessage({ text: err.response?.data?.message || 'Error changing password', type: 'error' });
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="max-w-xl mx-auto space-y-8">
        <h2 className="text-2xl font-bold flex items-center gap-3"><Settings className="text-school-primary" /> Settings</h2>
        
        <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Lock size={20} className="text-gray-400" /> Change Password</h3>
           
           {message.text && (
             <div className={`p-4 rounded-xl mb-6 font-semibold text-sm flex items-center gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {message.type === 'success' && <Check size={18} />}
                {message.text}
             </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Current Password</label>
                 <input type="password" required className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-school-primary" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
              </div>
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">New Password</label>
                 <input type="password" required className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-school-primary" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2 ml-2">Re-type New Password</label>
                 <input type="password" required className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-school-primary" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
              <button disabled={loading} className="btn-primary w-full py-4 mt-4 disabled:opacity-70 font-bold">
                 {loading ? 'Saving Changes...' : 'Save Change'}
              </button>
           </form>
        </div>
      </div>
   );
};

export default ManageSettings;
