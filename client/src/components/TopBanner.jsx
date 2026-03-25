import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const TopBanner = () => {
  return (
    <div className="bg-school-primary text-white py-1.5 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <a href="tel:+977081555555" className="flex items-center hover:text-school-accent transition-colors">
            <Phone size={12} className="mr-1.5" />
            <span>(+977)-081-XXXXXX</span>
          </a>
          <a href="mailto:info@gmsskhajura.edu.np" className="flex items-center hover:text-school-accent transition-colors">
            <Mail size={12} className="mr-1.5" />
            <span>info@gmsskhajura.edu.np</span>
          </a>
        </div>
        <div className="hidden sm:flex items-center space-x-4">
          <div className="flex items-center">
             <MapPin size={12} className="mr-1.5" />
             <span>Khajura, Banke</span>
          </div>
          <div className="flex items-center gap-2 border-l border-white/20 pl-4">
             <span className="cursor-pointer hover:text-school-accent">EN</span>
             <span className="opacity-50">|</span>
             <span className="cursor-pointer hover:text-school-accent">ने</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
