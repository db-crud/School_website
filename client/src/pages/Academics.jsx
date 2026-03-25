import React from 'react';
import { Book, GraduationCap, Microscope, Palette, Binary, Languages } from 'lucide-react';

const Academics = () => {
  const levels = [
    { 
      name: 'Primary Level (Class 1-5)', 
      icon: <Palette className="text-pink-500" />,
      desc: 'Foundation years focusing on literacy, numeracy, and social skills.',
      subjects: ['English', 'Nepali', 'Mathematics', 'Science', 'Social Studies', 'Creative Arts']
    },
    { 
      name: 'Lower Secondary (Class 6-8)', 
      icon: <Languages className="text-emerald-500" />,
      desc: 'Developing critical thinking and exploring broader academic subjects.',
      subjects: ['English', 'Nepali', 'Mathematics', 'Science', 'Social Studies', 'Moral Education', 'Computer']
    },
    { 
      name: 'Secondary (Class 9-10)', 
      icon: <Microscope className="text-green-500" />,
      desc: 'Preparation for SEE with a focus on core academic excellence.',
      subjects: ['English', 'Nepali', 'Compulsory Maths', 'Opt. Maths', 'Science', 'Social Studies', 'EPH']
    },
    { 
      name: 'Higher Secondary (Class 11-12)', 
      icon: <GraduationCap className="text-school-primary" />,
      desc: 'Advanced specialized streams to prepare students for University.',
      subjects: ['Science Stream', 'Management Stream', 'Education Stream', 'Humanities Stream']
    }
  ];

  return (
    <div className="bg-white">
      {/* Banner */}
      <div className="bg-school-secondary py-20 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Academic Programs</h1>
        <p className="text-gray-300 italic max-w-2xl mx-auto">Cultivating a love for learning and excellence in every student.</p>
      </div>

      {/* Intro */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 underline decoration-school-accent decoration-4 underline-offset-8">Our Teaching Approach</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            At GMSS Khajura, we follow a student-centric pedagogy. Our teachers use modern teaching aids, project-based learning, and regular assessments to ensure that every child reaches their full potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {levels.map((level, idx) => (
             <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="flex items-center space-x-4 mb-6">
                   <div className="p-4 bg-gray-50 rounded-2xl">{level.icon}</div>
                   <h3 className="text-2xl font-bold text-school-primary">{level.name}</h3>
                </div>
                <p className="text-gray-600 mb-6 italic">{level.desc}</p>
                <div className="mt-auto">
                   <h4 className="font-bold text-gray-900 mb-3 border-l-4 border-school-accent pl-3">Subjects Offered:</h4>
                   <div className="flex flex-wrap gap-2">
                      {level.subjects.map((sub, sidx) => (
                        <span key={sidx} className="bg-school-light text-school-secondary px-3 py-1 rounded-full text-sm font-medium">
                           {sub}
                        </span>
                      ))}
                   </div>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Examination System */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-white rounded-[40px] p-10 md:p-16 shadow-lg border-t-8 border-school-primary">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Examination & Evaluation</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="p-6 bg-emerald-50 rounded-2xl">
                    <h4 className="font-bold text-school-primary text-xl mb-3">Terminal Exams</h4>
                    <p className="text-gray-600 text-sm italic">Three major terminal examinations held throughout the academic year to monitor progress.</p>
                 </div>
                 <div className="p-6 bg-amber-50 rounded-2xl">
                    <h4 className="font-bold text-amber-700 text-xl mb-3">Continuous Evaluation</h4>
                    <p className="text-gray-600 text-sm italic">Weekly tests, project work, and classroom participation contribute to the final grading.</p>
                 </div>
                 <div className="p-6 bg-green-50 rounded-2xl">
                    <h4 className="font-bold text-green-700 text-xl mb-3">Reporting</h4>
                    <p className="text-gray-600 text-sm italic">Detailed progress reports provided to parents after each terminal exam with teacher feedback.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Academics;
