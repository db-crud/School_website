import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import { BookOpen, UserCheck, Trophy, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Home = () => {
  const [welcomeContent, setWelcomeContent] = useState({
    welcome_heading: 'Welcome to GMSS Khajura',
    welcome_description: 'Gyanodaya Model Secondary School stands as a beacon of learning in Khajura, Banke. With a rich history of academic success and a commitment to nurturing the next generation of leaders, we provide a safe, inclusive, and challenging environment for our students.\n\nWe believe in more than just books; we believe in character, creativity, and the courage to change the world. Explore our programs and join our community.',
    why_choose_heading: 'Why Choose Us?',
    why_choose_subtitle: 'Developing the potential of every student through comprehensive care and quality education.',
    feature_1_title: 'Quality Education',
    feature_1_desc: 'Modern curriculum\nActive learning approaches\nHolistic development',
    feature_2_title: 'Expert Faculty',
    feature_2_desc: 'Highly qualified educators\nPassionate teaching\nContinuous mentorship',
    feature_3_title: 'Achievements',
    feature_3_desc: 'Consistent toppers\nExtra-curricular winners\nSports champions'
  });
  const [welcomeImages, setWelcomeImages] = useState([]);
  const [latestNotices, setLatestNotices] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get('/content?page=home');
        const data = res.data.data;
        if (data && data.length > 0) {
          const newContent = { ...welcomeContent };
          data.forEach(item => {
            if (newContent[item.section_key] !== undefined) {
              newContent[item.section_key] = item.section_value;
            }
          });
          setWelcomeContent(newContent);
        }
      } catch (err) {
        console.error('Error fetching home content:', err);
      }
    };
    
    const fetchImages = async () => {
      try {
        const res = await api.get('/gallery');
        const galleryImages = res.data.data;
        const welcomeCategoryImages = galleryImages.filter(img => img.category === 'Welcome Section');
        setWelcomeImages(welcomeCategoryImages);
      } catch (err) {
        console.error('Error fetching welcome images:', err);
      }
    }

    const fetchNotices = async () => {
      try {
        const res = await api.get('/notices');
        if (res.data && Array.isArray(res.data.data)) {
          const sortedNotices = [...res.data.data].sort((a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id);
          setLatestNotices(sortedNotices.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching notices:', err);
      }
    };

    fetchContent();
    fetchImages();
    fetchNotices();
  }, []);
  const features = [
    { title: welcomeContent.feature_1_title, icon: <BookOpen className="w-12 h-12 text-school-primary" />, desc: welcomeContent.feature_1_desc },
    { title: welcomeContent.feature_2_title, icon: <UserCheck className="w-12 h-12 text-school-primary" />, desc: welcomeContent.feature_2_desc },
    { title: welcomeContent.feature_3_title, icon: <Trophy className="w-12 h-12 text-school-primary" />, desc: welcomeContent.feature_3_desc },
  ];

  return (
    <div className="bg-white">
      <Hero />
      
      {/* Welcome Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 relative pb-2 inline-block">
              {welcomeContent.welcome_heading}
              <div className="absolute bottom-0 left-0 w-24 h-1 bg-school-accent"></div>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6 text-lg whitespace-pre-line">
              {welcomeContent.welcome_description}
            </p>
            <Link to="/about" className="text-school-primary font-bold hover:underline">Learn more about our history →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <img src={welcomeImages[0]?.image_url || "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop"} alt="School Life" className="rounded-2xl shadow-xl w-full h-64 object-cover mt-8" />
             <img src={welcomeImages[1]?.image_url || "https://images.unsplash.com/photo-1577891729319-f4871c674881?q=80&w=1000&auto=format&fit=crop"} alt="Students" className="rounded-2xl shadow-xl w-full h-64 object-cover" />
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{welcomeContent.why_choose_heading}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto italic">{welcomeContent.why_choose_subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg border-b-4 border-white hover:border-school-primary transition-all text-center">
                <div className="mb-6 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <ul className="text-gray-600 italic leading-relaxed text-sm space-y-3 text-left inline-block w-full">
                  {(feature.desc || '').split('\n').filter(line => line.trim() !== '').map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                       <span className="w-2 h-2 bg-school-accent rounded-full flex-shrink-0 mt-1.5"></span>
                       <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Notices Overview */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-bold text-gray-900 border-l-8 border-school-accent pl-4">Latest Notices</h2>
            <Link to="/notices" className="text-school-primary font-semibold hover:underline">View All →</Link>
        </div>
        <div className="bg-school-light rounded-3xl p-8 md:p-12 shadow-inner border border-gray-200">
          <div className="space-y-6">
             {latestNotices.length > 0 ? (
               latestNotices.map((notice, idx) => (
                 <a 
                   key={notice.id || idx}
                   href={notice.attachment_url || "/notices"} 
                   target={notice.attachment_url ? "_blank" : "_self"}
                   rel={notice.attachment_url ? "noopener noreferrer" : ""}
                   className="bg-white p-6 rounded-xl flex items-center space-x-6 shadow-sm border-l-4 border-school-primary hover:shadow-md transition-shadow cursor-pointer"
                 >
                   <div className="bg-blue-50 p-4 rounded-full text-school-primary flex-shrink-0"><Bell /></div>
                   <div>
                      <h4 className="font-bold text-lg text-gray-800 hover:text-school-primary transition-colors">{notice.title}</h4>
                      <p className="text-gray-500 text-sm italic">{new Date(notice.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) || notice.date}</p>
                   </div>
                 </a>
               ))
             ) : (
               <div className="text-center text-gray-500 italic py-4">No latest notices available.</div>
             )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
