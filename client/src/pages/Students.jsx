import React from 'react';
import { Trophy, Users, BookOpen, Music, Share2, Star } from 'lucide-react';

const Students = () => {
  const activities = [
    { title: 'Sports Club', icon: <Trophy size={32} />, desc: 'Encouraging physical fitness and team spirit through various sports tournaments.' },
    { title: 'Cultural Club', icon: <Music size={32} />, desc: 'Promoting traditional Nepalese music, dance, and arts.' },
    { title: 'Science & Tech', icon: <Microscope size={32} />, desc: 'Fostering innovation through science fairs and coding workshops.' },
    { title: 'Eco Club', icon: <Share2 size={32} />, desc: 'Focusing on environmental awareness and tree plantation drives.' }
  ];

  return (
    <div className="bg-white">
      {/* Banner */}
      <div className="bg-school-primary py-20 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Students Life</h1>
        <p className="text-emerald-100 italic max-w-2xl mx-auto">Beyond the classroom: Fostering growth, leadership, and creativity.</p>
      </div>

      {/* Extracurricular Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Academic & Extra-Curricular Clubs</h2>
          <p className="text-gray-600 italic">Explore your passions and develop new skills with our student organizations.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {activities.map((item, index) => (
            <div key={index} className="bg-school-light p-8 rounded-[40px] border border-emerald-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-school-primary mb-6 shadow-sm group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 text-sm italic">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Student Achievements */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <span className="text-school-primary font-bold uppercase tracking-widest text-sm mb-4 block">Excellence at GMSS</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">Student Achievements & Recognition</h2>
              <p className="text-gray-600 italic mb-8">We take pride in the accomplishments of our students, whether it's academic excellence, winning regional sports meets, or contributing to the local community.</p>
              
              <div className="space-y-4">
                {[
                  'National Level Math Olympiad Winners (2023)',
                  'Regional Football Championship - Gold Medalist',
                  'Community Service Excellence Award from Khajura Palika',
                  '100% Success Rate in SEE Examinations'
                ].map((msg, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Star className="text-school-accent" size={20} fill="#fbbf24" />
                    <span className="text-gray-800 font-semibold italic">{msg}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="aspect-square bg-school-primary rounded-[50px] overflow-hidden shadow-2xl">
                 <img src="https://images.unsplash.com/photo-1523240715630-f9d7bc181b9e?q=80&w=1000&auto=format&fit=crop" alt="Students" className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="aspect-square bg-school-accent rounded-[50px] mt-12 overflow-hidden shadow-2xl">
                 <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000&auto=format&fit=crop" alt="Group" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Council */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center border-t border-gray-100">
         <Users size={64} className="text-school-primary mx-auto mb-6" />
         <h2 className="text-3xl font-bold text-gray-900 mb-4">Student Council</h2>
         <p className="text-gray-600 italic max-w-2xl mx-auto mb-10">Our student leaders help coordinate events, represent student interests, and maintain a positive school environment.</p>
         <div className="bg-school-primary text-white p-8 rounded-[40px] inline-block shadow-2xl transform hover:scale-105 transition-transform cursor-pointer">
            <h4 className="text-xl font-bold">Applications Opening for 2024-25</h4>
            <p className="text-emerald-100 text-sm mt-1 italic">Join the leadership team!</p>
         </div>
      </section>
    </div>
  );
};

export default Students;
