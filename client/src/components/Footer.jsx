import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import api from '../utils/api';

const Footer = () => {
  const [footerContent, setFooterContent] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get('/content?page=contact');
        if (res.data?.success && Array.isArray(res.data.data)) {
           const contentMap = {};
           res.data.data.forEach(item => { contentMap[item.section_key] = item.section_value; });
           setFooterContent(contentMap);
        }
      } catch (err) {
         console.error('Error fetching contact content for footer:', err);
      }
    };
    fetchContent();
  }, []);

  return (
    <footer className="bg-school-secondary text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* School Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold mb-4">GMSS Khajura</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Providing quality education and fostering excellence since 19XX. Our mission is to empower students with knowledge and values.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-school-accent transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-school-accent transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-school-accent transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-school-primary pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/about" className="hover:text-school-accent">About Us</Link></li>
              <li><Link to="/academics" className="hover:text-school-accent">Academics</Link></li>
              <li><Link to="/admissions" className="hover:text-school-accent">Admissions</Link></li>
              <li><Link to="/gallery" className="hover:text-school-accent">School Gallery</Link></li>
              <li><Link to="/notices" className="hover:text-school-accent">Latest Notices</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-school-primary pb-2 inline-block">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-school-accent flex-shrink-0 mt-0.5" />
                <span className="whitespace-pre-line">{footerContent.contact_address || 'Khajura, Banke, Nepal'}</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone size={18} className="text-school-accent flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                   <span>{footerContent.contact_phone_1 || '+977-XX-XXXXXX'}</span>
                   {footerContent.contact_phone_2 && <span>{footerContent.contact_phone_2}</span>}
                </div>
              </li>
              <li className="flex items-start space-x-3 break-all">
                <Mail size={18} className="text-school-accent flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                   <span>{footerContent.contact_email_1 || 'info@gmsskhajura.edu.np'}</span>
                   {footerContent.contact_email_2 && <span>{footerContent.contact_email_2}</span>}
                </div>
              </li>
            </ul>
          </div>

          {/* Google Map / Location Brief */}
          <div>
             <h3 className="text-lg font-semibold mb-4 border-b border-school-primary pb-2 inline-block">Find Us</h3>
             <div className="rounded-lg overflow-hidden h-40 bg-gray-700 shadow-inner">
               <iframe 
                 src={footerContent.contact_map_url || "https://maps.google.com/maps?q=Khajura,Banke,Nepal&t=&z=15&ie=UTF8&iwloc=&output=embed"}
                 width="100%" 
                 height="100%" 
                 style={{ border: 0 }} 
                 allowFullScreen="" 
                 loading="lazy" 
                 referrerPolicy="no-referrer-when-downgrade"
                 title="School Location map footer"
               ></iframe>
             </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 mt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Gyanodaya Model Secondary School, Khajura. All rights reserved.</p>
          <p className="mt-1">Designed for Excellence.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
