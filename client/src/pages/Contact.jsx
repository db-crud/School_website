import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });
  const [contactContent, setContactContent] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get('/content?page=contact');
        if (res.data?.success && Array.isArray(res.data.data)) {
           const contentMap = {};
           res.data.data.forEach(item => { contentMap[item.section_key] = item.section_value; });
           setContactContent(contentMap);
        }
      } catch (err) {
         console.error('Error fetching contact content:', err);
      }
    };
    fetchContent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });
    try {
      const res = await api.post('/contact', formData);
      if (res.data.success) {
        setStatus({ loading: false, success: true, error: '' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: 'Failed to send message. Please try again later.' });
    }
  };

  return (
    <div className="bg-white">
      {/* Banner */}
      <div className="school-gradient py-20 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-200 italic max-w-2xl mx-auto">Have questions? We're here to help you. Reach out to us through any of the channels below.</p>
      </div>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Details */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 border-l-8 border-school-accent pl-4">Get In Touch</h2>
            <div className="space-y-8 mb-12">
               <div className="flex items-start space-x-6">
                  <div className="bg-school-light p-4 rounded-2xl text-school-primary shadow-sm"><MapPin size={28} /></div>
                  <div>
                     <h4 className="font-bold text-xl mb-1">Our Location</h4>
                     <p className="text-gray-600 italic whitespace-pre-line">{contactContent.contact_address || 'Khajura, Banke, Nepal'}</p>
                  </div>
               </div>
               <div className="flex items-start space-x-6">
                  <div className="bg-school-light p-4 rounded-2xl text-school-primary shadow-sm"><Phone size={28} /></div>
                  <div>
                     <h4 className="font-bold text-xl mb-1">Phone Number</h4>
                     <p className="text-gray-600 italic">{contactContent.contact_phone_1 || '+977-XX-XXXXXX'}</p>
                     {contactContent.contact_phone_2 && <p className="text-gray-600 italic">{contactContent.contact_phone_2}</p>}
                  </div>
               </div>
               <div className="flex items-start space-x-6">
                  <div className="bg-school-light p-4 rounded-2xl text-school-primary shadow-sm"><Mail size={28} /></div>
                  <div>
                     <h4 className="font-bold text-xl mb-1">Email Address</h4>
                     <p className="text-gray-600 italic">{contactContent.contact_email_1 || 'info@gmsskhajura.edu.np'}</p>
                     {contactContent.contact_email_2 && <p className="text-gray-600 italic">{contactContent.contact_email_2}</p>}
                  </div>
               </div>
            </div>

            {/* Map */}
            <div className="rounded-[40px] overflow-hidden shadow-2xl h-[350px] bg-gray-100 border-4 border-white">
                <iframe 
                  src={contactContent.contact_map_url || "https://maps.google.com/maps?q=Gyanodaya%20Secondary%20School%20Khajura&t=&z=15&ie=UTF8&iwloc=&output=embed"}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="School Location Map"
                ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-10 md:p-12 rounded-[50px] shadow-inner border border-gray-100">
             <h3 className="text-2xl font-bold text-school-primary mb-8">Send Us a Message</h3>
             {status.success ? (
               <div className="bg-green-100 border border-green-200 text-green-700 p-8 rounded-3xl text-center animate-bounce">
                  <CheckCircle size={48} className="mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-2">Message Sent!</h4>
                  <p className="italic">Thank you for reaching out. We will get back to you shortly.</p>
                  <button onClick={() => setStatus({ ...status, success: false })} className="mt-6 text-green-800 font-bold underline">Send another message</button>
               </div>
             ) : (
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Your Name *</label>
                        <input 
                           type="text" 
                           className="w-full px-5 py-4 rounded-2xl border border-white focus:ring-4 focus:ring-school-primary shadow-sm outline-none transition-all"
                           required
                           value={formData.name}
                           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                        <input 
                           type="email" 
                           className="w-full px-5 py-4 rounded-2xl border border-white focus:ring-4 focus:ring-school-primary shadow-sm outline-none transition-all"
                           required
                           value={formData.email}
                           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                     <input 
                        type="text" 
                        className="w-full px-5 py-4 rounded-2xl border border-white focus:ring-4 focus:ring-school-primary shadow-sm outline-none transition-all"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Your Message *</label>
                     <textarea 
                        className="w-full px-5 py-4 rounded-2xl border border-white focus:ring-4 focus:ring-school-primary shadow-sm outline-none transition-all h-40"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                     ></textarea>
                  </div>
                  {status.error && <p className="text-red-500 font-bold italic">{status.error}</p>}
                  <button 
                     type="submit" 
                     className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3 shadow-xl transform active:scale-95"
                     disabled={status.loading}
                  >
                     {status.loading ? 'Sending...' : <>Send Message <Send size={20} /></>}
                  </button>
               </form>
             )}
          </div>

        </div>
      </section>
    </div>
  );
};

export default Contact;
