import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../utils/api';

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [contentStats, setContentStats] = useState({
    hero_stat_1: '1500+ Students Enrolled',
    hero_stat_2: '50+ Expert Teachers',
    hero_stat_3: '25+ Years of Excellence',
    hero_welcome_text: 'Welcome to Gyanodaya Model Secondary School',
    hero_heading: 'Empowering Minds, Structuring Futures',
    hero_description: 'A leading institution committed to academic excellence, character building, and holistic development in the heart of Khajura, Banke.'
  });

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await api.get('/gallery');
        const galleryImages = res.data.data;
        // Filter those added as 'Hero Slider'
        const heroImages = galleryImages.filter(img => img.category === 'Hero Slider');
        if (heroImages.length > 0) {
          setSlides(heroImages);
        }
      } catch (err) {
        console.error('Error fetching hero slides:', err);
      }
    };
    const fetchStats = async () => {
      try {
        const res = await api.get('/content?page=home');
        const statsData = res.data.data;
        
        if (statsData.length > 0) {
           const newStats = { ...contentStats };
           statsData.forEach(item => {
              if (newStats[item.section_key] !== undefined) {
                 newStats[item.section_key] = item.section_value;
              }
           });
           setContentStats(newStats);
        }
      } catch (e) {
         console.error('Error fetching stats:', e);
      }
    };
    
    fetchSlides();
    fetchStats();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000); // Change slide every 10 seconds
    return () => clearInterval(interval);
  }, [slides.length]);

  const activeImage = slides.length > 0 
    ? slides[currentSlide].image_url 
    : "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop";

  const activeTitle = slides.length > 0 ? slides[currentSlide].title : "";

  return (
    <div className="relative min-h-[700px] flex items-center overflow-hidden group bg-slate-50 pt-10 pb-20 md:py-24">
      {/* Background Decor/Pattern */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-white/80"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center pb-20">
        
        {/* Left Column: Original Text */}
        <div className="animate-fade-in-up md:pr-10 text-center lg:text-left mt-10 md:mt-0">
          <h4 className="text-school-accent font-bold tracking-widest uppercase mb-4 drop-shadow-sm">
            {contentStats.hero_welcome_text}
          </h4>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-school-primary drop-shadow-sm">
            <span className="block">{contentStats.hero_heading}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed font-medium">
            {contentStats.hero_description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link to="/admissions" className="btn-accent text-lg">
              Admission Open
            </Link>
            <Link to="/contact" className="bg-white text-school-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all text-lg shadow-lg">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Right Column: Photo Slider */}
        <div className="relative h-[350px] md:h-[450px] lg:h-[500px] w-full rounded-[30px] overflow-hidden shadow-2xl border-[6px] border-white group bg-white/50">
          
          {slides.length > 0 ? (
            slides.map((slide, index) => (
              <div 
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              >
                {/* Blurred background */}
                <div className={`absolute inset-0 bg-cover bg-center blur-2xl opacity-60 transition-transform duration-[10000ms] ease-linear ${index === currentSlide ? 'scale-110' : 'scale-100'}`} style={{ backgroundImage: `url('${slide.image_url}')` }}></div>
                {/* Actual image contained */}
                <div className={`absolute inset-0 bg-contain bg-center bg-no-repeat transition-transform duration-[10000ms] ease-linear ${index === currentSlide ? 'scale-105' : 'scale-100'}`} style={{ backgroundImage: `url('${slide.image_url}')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10"></div>
              </div>
            ))
          ) : (
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-cover bg-center blur-2xl opacity-60" style={{ backgroundImage: `url('${activeImage}')` }}></div>
              <div className="absolute inset-0 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url('${activeImage}')` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10"></div>
            </div>
          )}

          {/* Title overlay floating inside the right slider */}
          {activeTitle && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex flex-col items-center w-[90%] md:w-auto animate-fade-in-up">
              <div className="bg-[#4b6fa6]/95 w-full md:w-auto px-8 py-3 shadow-2xl rounded-xl border-b-[4px] border-school-accent">
                <h2 className="text-white text-lg md:text-xl font-bold tracking-wide uppercase leading-snug truncate text-center">{activeTitle}</h2>
              </div>
            </div>
          )}

          {/* Slider Controls */}
          {slides.length > 1 && (
            <>
              <div className="absolute top-4 right-4 flex space-x-2 z-20 pointer-events-auto bg-black/40 px-3 py-2 rounded-full backdrop-blur-sm">
                {slides.map((_, index) => (
                  <button 
                    key={index} 
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${index === currentSlide ? 'w-6 bg-school-accent' : 'w-2 bg-white/50 hover:bg-white'}`}
                  />
                ))}
              </div>

              <button 
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-school-primary text-white p-2 rounded-full backdrop-blur-sm transition-all z-20 opacity-0 group-hover:opacity-100 pointer-events-auto shadow-lg"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-school-primary text-white p-2 rounded-full backdrop-blur-sm transition-all z-20 opacity-0 group-hover:opacity-100 pointer-events-auto shadow-lg"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hero Stats */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-green-50 via-green-100 to-emerald-100 py-6 hidden lg:block border-y-4 border-green-300 shadow-xl z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-3 gap-8">
          <div className="text-center bg-white/60 py-4 px-6 rounded-2xl shadow-sm border border-green-200 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-school-primary">{contentStats.hero_stat_1}</h3>
          </div>
          <div className="text-center bg-white/60 py-4 px-6 rounded-2xl shadow-sm border border-green-200 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-school-primary">{contentStats.hero_stat_2}</h3>
          </div>
          <div className="text-center bg-white/60 py-4 px-6 rounded-2xl shadow-sm border border-green-200 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-school-primary">{contentStats.hero_stat_3}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
