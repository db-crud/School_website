import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TopBanner from './components/TopBanner';
import HeaderLogoBar from './components/HeaderLogoBar';
import NoticeBanner from './components/NoticeBanner';
import AdmissionBanner from './components/AdmissionBanner';
import PopupNotice from './components/PopupNotice';

import Home from './pages/Home';
import About from './pages/About';
import Academics from './pages/Academics';
import Admissions from './pages/Admissions';
import Teachers from './pages/Teachers';
import Gallery from './pages/Gallery';
import Notices from './pages/Notices';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import ManageNotices from './pages/admin/ManageNotices';
import ManageTeachers from './pages/admin/ManageTeachers';
import ManageGallery from './pages/admin/ManageGallery';
import ManageMessages from './pages/admin/ManageMessages';
import ManageContent from './pages/admin/ManageContent';
import ManageSettings from './pages/admin/ManageSettings';
import Students from './pages/Students';

// Other Admin Pages (Placeholders)
const AdminDashboard = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
       <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Total Notices</h3>
       <p className="text-5xl font-black text-school-primary">12</p>
    </div>
    <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
       <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">New Messages</h3>
       <p className="text-5xl font-black text-school-accent">5</p>
    </div>
    <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
       <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Gallery Size</h3>
       <p className="text-5xl font-black text-green-600">48</p>
    </div>
  </div>
);

// Public Pages (Placeholders)


function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen relative">
      {!isAdminPath && <PopupNotice />}
      {!isAdminPath && <TopBanner />}
      {!isAdminPath && <HeaderLogoBar />}
      {!isAdminPath && <Navbar />}
      {!isAdminPath && <NoticeBanner />}
      {!isAdminPath && <AdmissionBanner />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/students" element={<Students />} />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="notices" element={<ManageNotices />} />
            <Route path="teachers" element={<ManageTeachers />} />
            <Route path="gallery" element={<ManageGallery />} />
            <Route path="messages" element={<ManageMessages />} />
            <Route path="content" element={<ManageContent />} />
            <Route path="settings" element={<ManageSettings />} />
          </Route>
        </Routes>
      </main>
      
      {!isAdminPath && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
