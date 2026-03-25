import React, { useState, useEffect } from 'react';
import { Target, Eye, Clock, Award } from 'lucide-react';
import api from '../utils/api';

const About = () => {
  const [aboutContent, setAboutContent] = useState({
    about_banner_title: 'About Our School',
    about_banner_subtitle: 'Nurturing excellence, character, and leadership since 19XX.',
    about_intro_heading: 'Our Legacy & Commitment',
    about_intro_desc_1: "Gyanodaya Model Secondary School is more than just an educational institution; it's a platform where dreams take flight. Located in the vibrant community of Khajura, we have been providing high-quality education to students from diverse backgrounds.",
    about_intro_desc_2: 'Our school is recognized for its academic rigor, disciplined environment, and wide range of co-curricular activities. We focus on holistic development, ensuring that our students are not only academically proficient but also ethically sound and socially responsible.',
    about_est_year: '19XX',
    about_mission: 'To provide a stimulating learning environment that encourages high expectations for success through development-appropriate instruction that allows for individual differences and learning styles.',
    about_vision: 'To be a centre of excellence in education, where students are empowered to meet the challenges of the future while remaining rooted in cultural values and social ethics.',
    about_principal_heading: 'Message from the Principal',
    about_principal_subtitle: 'Dedicated to Student Success',
    about_principal_desc: 'We are committed to providing our students with the best possible resources and guidance. Our faculty is dedicated to not just teaching, but mentoring students for life.',
    about_principal_name: 'Principal Name',
    about_principal_title: 'Principal, GMSS Khajura',
    about_principal_image_url: '',
    about_vice_principal_heading: 'Message from the Vice Principal',
    about_vice_principal_subtitle: 'Fostering Academic Excellence',
    about_vice_principal_desc: 'We believe in a balanced approach to education, combining strong academic foundations with vital extracurricular engagements.',
    about_vice_principal_name: 'Vice Principal Name',
    about_vice_principal_title: 'Vice Principal, GMSS Khajura',
    about_vice_principal_image_url: ''
  });

  const [aboutImages, setAboutImages] = useState({
     aboutUs: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1000&auto=format&fit=crop",
     principal: "https://images.unsplash.com/photo-1544717297-fa154da09f5b?q=80&w=1000&auto=format&fit=crop"
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get('/content?page=about');
        const data = res.data.data;
        if (data && data.length > 0) {
          const newContent = { ...aboutContent };
          data.forEach(item => {
            if (newContent[item.section_key] !== undefined) {
              newContent[item.section_key] = item.section_value;
            }
          });
          setAboutContent(newContent);
        }
      } catch (err) {
        console.error('Error fetching about content:', err);
      }
    };

    const fetchImages = async () => {
      try {
        const res = await api.get('/gallery');
        const galleryImages = res.data.data;
        const aboutImg = galleryImages.find(img => img.category === 'About Us');
        const principalImg = galleryImages.find(img => img.category === 'Principal');
        
        setAboutImages(prev => ({
           aboutUs: aboutImg ? aboutImg.image_url : prev.aboutUs,
           principal: principalImg ? principalImg.image_url : prev.principal
        }));
      } catch (err) {
        console.error('Error fetching about images:', err);
      }
    };

    fetchContent();
    fetchImages();
  }, []);
  return (
    <div className="bg-white">
      {/* Banner */}
      <div className="bg-school-primary py-20 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{aboutContent.about_banner_title}</h1>
        <p className="text-gray-300 italic max-w-2xl mx-auto">{aboutContent.about_banner_subtitle}</p>
      </div>

      {/* Main Intro */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
             <img src={aboutImages.aboutUs} alt="School Building" className="rounded-3xl shadow-2xl w-full h-auto object-cover max-h-[500px]" />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{aboutContent.about_intro_heading}</h2>
            <p className="text-gray-600 mb-6 leading-relaxed text-lg italic">
              {aboutContent.about_intro_desc_1}
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {aboutContent.about_intro_desc_2}
            </p>
            <div className="grid grid-cols-2 gap-4">
               <div className="flex items-center space-x-3 text-school-primary font-bold">
                  <Clock size={24} className="text-school-accent" />
                  <span>Est. {aboutContent.about_est_year}</span>
               </div>
               <div className="flex items-center space-x-3 text-school-primary font-bold">
                  <Award size={24} className="text-school-accent" />
                  <span>Model School</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-school-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
           <div className="bg-white p-10 rounded-3xl shadow-lg hover:translate-y-[-10px] transition-transform duration-300">
              <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center rounded-2xl mb-6">
                 <Target className="text-school-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed italic">
                {aboutContent.about_mission}
              </p>
           </div>
           <div className="bg-white p-10 rounded-3xl shadow-lg hover:translate-y-[-10px] transition-transform duration-300">
              <div className="w-16 h-16 bg-amber-100 flex items-center justify-center rounded-2xl mb-6">
                 <Eye className="text-school-accent" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed italic">
                {aboutContent.about_vision}
              </p>
           </div>
        </div>
      </section>

      {/* Messages Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
           {/* Principal Message - Left Column */}
           <div className="bg-white border-2 border-school-light rounded-[40px] p-8 md:p-10 shadow-xl flex flex-col hover:-translate-y-2 transition-transform duration-300 h-full">
              <div className="flex items-center gap-6 mb-8">
                 <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-school-accent shadow-md">
                    <img src={aboutContent.about_principal_image_url || aboutImages.principal || "https://images.unsplash.com/photo-1544717297-fa154da09f5b?q=80&w=1000&auto=format&fit=crop"} alt="Principal" className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">{aboutContent.about_principal_heading}</h2>
                    <p className="text-school-primary font-bold italic">{aboutContent.about_principal_subtitle}</p>
                 </div>
              </div>
              <p className="text-gray-600 mb-8 leading-relaxed md:text-lg flex-grow whitespace-pre-line italic">
                {aboutContent.about_principal_desc}
              </p>
              <div className="mt-auto border-t border-gray-100 pt-6">
                 <h4 className="font-bold text-xl text-gray-900 leading-none">{aboutContent.about_principal_name}</h4>
                 <p className="text-gray-500 font-medium mt-2">{aboutContent.about_principal_title}</p>
              </div>
           </div>

           {/* Vice Principal Message - Right Column */}
           <div className="bg-white border-2 border-school-light rounded-[40px] p-8 md:p-10 shadow-xl flex flex-col hover:-translate-y-2 transition-transform duration-300 h-full">
              <div className="flex items-center gap-6 mb-8">
                 <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-school-accent shadow-md">
                    <img src={aboutContent.about_vice_principal_image_url || "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop"} alt="Vice Principal" className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">{aboutContent.about_vice_principal_heading}</h2>
                    <p className="text-school-primary font-bold italic">{aboutContent.about_vice_principal_subtitle}</p>
                 </div>
              </div>
              <p className="text-gray-600 mb-8 leading-relaxed md:text-lg flex-grow whitespace-pre-line italic">
                {aboutContent.about_vice_principal_desc}
              </p>
              <div className="mt-auto border-t border-gray-100 pt-6">
                 <h4 className="font-bold text-xl text-gray-900 leading-none">{aboutContent.about_vice_principal_name}</h4>
                 <p className="text-gray-500 font-medium mt-2">{aboutContent.about_vice_principal_title}</p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default About;
