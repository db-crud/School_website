import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home as HomeIcon, ChevronDown } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const logoExists = true;

  const primaryLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const moreLinks = [
    { name: 'Academics', path: '/academics' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Teachers', path: '/teachers' },
    { name: 'Students', path: '/students' },
    { name: 'Notices', path: '/notices' },
  ];

  return (
    <nav className="bg-school-primary shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link to="/" className="text-white hover:bg-white/10 px-4 py-4 text-sm font-bold transition-colors flex items-center h-full">
              <HomeIcon size={18} />
            </Link>
            {primaryLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-white hover:bg-white/10 px-4 py-4 text-sm font-bold transition-colors h-full flex items-center border-b-2 border-transparent hover:border-school-accent"
              >
                {link.name}
              </Link>
            ))}

            {/* More Dropdown */}
            <div 
              className="relative group h-full"
              onMouseEnter={() => setIsMoreOpen(true)}
              onMouseLeave={() => setIsMoreOpen(false)}
            >
              <button className="flex items-center text-white hover:bg-white/10 px-4 py-4 text-sm font-bold transition-colors h-full border-b-2 border-transparent hover:border-school-accent">
                <span>More</span>
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isMoreOpen && (
                <div className="absolute left-0 mt-0 w-48 bg-white rounded-b-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-school-light hover:text-school-primary font-bold transition-colors"
                      onClick={() => setIsMoreOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="flex items-center space-x-2">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-white/10 border border-white/20 text-white rounded-full py-1 px-4 text-xs focus:ring-1 focus:ring-school-accent outline-none w-32 md:w-48 placeholder-white/60"
                />
             </div>
             {/* Mobile menu button */}
             <div className="md:hidden flex items-center">
               <button
                 onClick={() => setIsOpen(!isOpen)}
                 className="text-white hover:bg-white/10 p-2 rounded-md focus:outline-none"
               >
                 {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-school-secondary border-t border-white/10 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 max-h-[70vh] overflow-y-auto">
            <Link
              to="/"
              className="block text-white hover:bg-white/10 px-3 py-2 rounded-md text-base font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            {[...primaryLinks, ...moreLinks].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block text-white hover:bg-white/10 px-3 py-2 rounded-md text-base font-semibold"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
