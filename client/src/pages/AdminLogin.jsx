import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Lock, User, ShieldCheck, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', credentials);
      if (res.data.success) {
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-school-light px-4">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-school-primary p-10 text-center">
           <div className="bg-white bg-opacity-20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
              <ShieldCheck className="text-white" size={40} />
           </div>
           <h2 className="text-2xl font-bold text-white">Admin Portal</h2>
           <p className="text-green-100 text-sm italic mt-1 font-medium">GMSS Khajura Management System</p>
        </div>

        <div className="p-10">
           {error && (
             <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 flex items-center gap-3 animate-shake">
                <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                <p className="text-red-700 text-sm font-bold italic">{error}</p>
             </div>
           )}

           <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                 <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                 <input 
                    type="text" 
                    placeholder="Username" 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-school-primary outline-none transition-all font-medium"
                    required
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                 />
              </div>
              <div className="relative">
                 <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                 <input 
                    type="password" 
                    placeholder="Password" 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-school-primary outline-none transition-all font-medium"
                    required
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                 />
              </div>
              <button 
                 type="submit" 
                 className="w-full btn-primary py-4 text-lg shadow-xl shadow-green-100 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                 disabled={loading}
              >
                 {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              </button>
           </form>
           <p className="text-center text-gray-400 text-xs mt-10 uppercase tracking-widest font-bold">Secure Access Only</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
