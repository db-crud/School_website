import React from 'react';
import { FileText, CheckCircle, Info, Download } from 'lucide-react';

const Admissions = () => {
  return (
    <div className="bg-white">
      {/* Banner */}
      <div className="bg-school-primary py-20 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Admissions {new Date().getFullYear()}</h1>
        <p className="text-school-accent font-bold italic text-xl">Join our vibrant academic community!</p>
      </div>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Eligibility & Info */}
          <div className="lg:col-span-2 space-y-12">
             <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                   <Info className="text-school-primary" /> Admission Eligibility
                </h2>
                <div className="prose lg:prose-xl text-gray-600">
                   <p>Admissions at GMSS Khajura are open for the new academic session. We welcome students who are eager to learn and grow in a disciplined environment.</p>
                   <ul className="list-disc pl-5 mt-4 space-y-2">
                      <li>Minimum age criteria as per Government of Nepal regulations.</li>
                      <li>Successful completion of previous class from a recognized institution.</li>
                      <li>Qualifying the school's entrance assessment (for Grade 2 and above).</li>
                      <li>Good moral character and conduct.</li>
                   </ul>
                </div>
             </div>

             <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                   <FileText className="text-school-primary" /> Required Documents
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {[
                     'Birth Certificate (Original + Copy)',
                     'Transfer Certificate (Original)',
                     'Progress Report / Mark sheet of previous class',
                     'Passport size photographs (4 copies)',
                     'Citizenship of Father/Mother (Copy)',
                     'Character Certificate (for Grade 9 and above)'
                   ].map((doc, idx) => (
                     <div key={idx} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                        <span className="text-gray-700 font-medium">{doc}</span>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-school-light p-10 rounded-3xl border-2 border-dashed border-school-primary text-center">
                <h3 className="text-2xl font-bold text-school-primary mb-4">Download Prospectus</h3>
                <p className="text-gray-600 mb-6 italic">Get detailed information about our school, facilities, and academic policies.</p>
                <button className="btn-primary flex items-center gap-2 mx-auto">
                   <Download size={20} /> Download PDF (5.2 MB)
                </button>
             </div>
          </div>

          {/* Quick Contact Form Mini */}
          <div className="lg:col-span-1">
             <div className="sticky top-28 bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Admission Inquiry</h3>
                <p className="text-gray-500 text-sm text-center mb-8 italic">Fill out the form below and we'll get back to you.</p>
                
                <form className="space-y-4">
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Student Name *</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-school-primary focus:border-transparent outline-none" required />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Applying Class *</label>
                      <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-school-primary focus:border-transparent outline-none">
                         <option>Select Class</option>
                         {[1,2,3,4,5,6,7,8,9,10,11,12].map(c => <option key={c}>Class {c}</option>)}
                      </select>
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Parent's Phone *</label>
                      <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-school-primary focus:border-transparent outline-none" required />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Query (if any)</label>
                      <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-school-primary focus:border-transparent outline-none h-24"></textarea>
                   </div>
                   <button type="button" className="w-full btn-accent text-lg shadow-lg">Submit Inquiry</button>
                   <p className="text-[10px] text-gray-400 text-center mt-4 uppercase tracking-widest font-bold italic">Safe & Secure Process</p>
                </form>
             </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Admissions;
