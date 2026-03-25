import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Mail, GraduationCap, Phone } from 'lucide-react';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get('/teachers');
        if (res.data.success) {
          setTeachers(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching teachers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  return (
    <div className="bg-white">
      {/* Banner */}
      <div className="school-gradient py-20 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Dedicated Faculty</h1>
        <p className="text-gray-200 italic max-w-2xl mx-auto">Experienced educators committed to shaping the future of our students.</p>
      </div>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-school-primary mx-auto"></div>
            <p className="mt-4 text-gray-500 italic">Loading faculty profiles...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <div key={teacher.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all group">
                  <div className="relative h-64 overflow-hidden bg-gray-100 flex items-center justify-center">
                    {teacher.photo_url ? (
                      <img 
                         src={teacher.photo_url} 
                         alt={teacher.name} 
                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="text-gray-300 font-black tracking-widest text-2xl -rotate-12 select-none">
                         NO PHOTO
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-school-secondary via-transparent opacity-0 group-hover:opacity-60 transition-opacity"></div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{teacher.name}</h3>
                    <p className="text-school-primary font-semibold text-sm uppercase tracking-wider mb-4">{teacher.subject}</p>
                    
                    <div className="flex flex-col items-center space-y-2 text-gray-500 text-sm">
                       <div className="flex items-center gap-2">
                          <GraduationCap size={16} className="text-school-accent flex-shrink-0" />
                          <span>{teacher.qualification}</span>
                       </div>
                       {teacher.contact_number && (
                         <div className="flex items-center gap-2">
                            <Phone size={16} className="text-school-accent flex-shrink-0" />
                            <span>{teacher.contact_number}</span>
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-school-light p-10 rounded-3xl text-center italic text-gray-500">
                Teacher profiles are being updated. Check back soon!
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Teachers;
