import React, { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bell, 
  Users, 
  Image as ImageIcon, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const userData = sessionStorage.getItem('user');
    if (!token || !userData) {
      navigate('/admin/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/admin/login');
  };

  const navItems = [
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { title: 'Notices', icon: <Bell size={20} />, path: '/admin/notices' },
    { title: 'Teachers', icon: <Users size={20} />, path: '/admin/teachers' },
    { title: 'Gallery', icon: <ImageIcon size={20} />, path: '/admin/gallery' },
    { title: 'Contact Messages', icon: <MessageSquare size={20} />, path: '/admin/messages' },
    { title: 'Site Content', icon: <Settings size={20} />, path: '/admin/content' },
  ];

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-school-secondary text-white flex flex-col shadow-2xl z-20">
        <div className="p-8 border-b border-white border-opacity-10 flex items-center space-x-3">
          <GraduationCap className="text-school-accent" size={32} />
          <div>
            <h1 className="font-bold text-lg leading-none">GMSS Admin</h1>
            <p className="text-[10px] uppercase tracking-widest text-school-accent mt-1">Management</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-200 group ${
                location.pathname === item.path 
                ? 'bg-school-accent text-school-secondary shadow-lg font-bold' 
                : 'hover:bg-white hover:bg-opacity-5 text-emerald-100'
              }`}
            >
              <div className="flex items-center space-x-4">
                {item.icon}
                <span>{item.title}</span>
              </div>
              <ChevronRight size={16} className={`opacity-0 group-hover:opacity-100 transition-opacity ${location.pathname === item.path ? 'opacity-100' : ''}`} />
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white border-opacity-10">
          <p className="text-center text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2 px-2">Secure Admin Area</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-24 bg-white shadow-sm flex items-center justify-between px-10 border-b border-gray-100">
           <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {navItems.find(item => item.path === location.pathname)?.title || 'Admin Portal'}
              </h2>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Logged in as {user.username}</p>
           </div>
           <div className="relative">
             <button 
                onClick={() => setShowDropdown(!showDropdown)} 
                className="flex items-center space-x-4 focus:outline-none group"
             >
                <div className="text-right hidden sm:block">
                   <p className="font-bold text-gray-900 leading-none group-hover:text-school-primary transition-colors">{user.username}</p>
                   <span className="text-[10px] text-gray-500 font-bold uppercase">{user.role}</span>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 font-extrabold text-xl border-2 border-white shadow-sm group-hover:ring-2 group-hover:ring-green-400 transition-all">
                   {user.username.charAt(0).toUpperCase()}
                </div>
             </button>

             {showDropdown && (
                <>
                   {/* Invisible backdrop to catch clicks outside */}
                   <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                   
                   <div className="absolute right-0 mt-4 w-48 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 z-50">
                      <Link 
                        to="/admin/settings"
                        className="w-full flex items-center space-x-3 px-6 py-4 text-gray-700 hover:bg-gray-50 font-bold transition-colors text-left border-b border-gray-50"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Settings size={18} strokeWidth={3} />
                        <span>Settings</span>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-6 py-4 text-red-500 hover:bg-red-50 font-bold transition-colors text-left"
                      >
                        <LogOut size={18} strokeWidth={3} />
                        <span>Logout</span>
                      </button>
                   </div>
                </>
             )}
           </div>
        </header>

        {/* Content Viewport */}
        <section className="flex-1 overflow-y-auto p-10">
           <div className="max-w-6xl mx-auto">
              <Outlet />
           </div>
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
