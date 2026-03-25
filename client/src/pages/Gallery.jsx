import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Image as ImageIcon, Maximize2 } from 'lucide-react';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        if (res.data.success) {
          setImages(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = ['All', ...new Set(images.map(img => img.category))];
  const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

  return (
    <div className="bg-white">
      {/* Banner */}
      <div className="bg-school-primary py-20 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Gallery</h1>
        <p className="text-gray-300 italic max-w-2xl mx-auto">Capturing moments of learning, joy, and achievement at GMSS Khajura.</p>
      </div>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
           {categories.map(cat => (
             <button
               key={cat}
               onClick={() => setFilter(cat)}
               className={`px-6 py-2 rounded-full font-bold transition-all ${filter === cat ? 'bg-school-accent text-school-secondary shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
             >
               {cat}
             </button>
           ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-pulse flex flex-col items-center">
               <ImageIcon size={48} className="text-gray-200 mb-4" />
               <p className="text-gray-400 italic">Preparing visual showcase...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.length > 0 ? (
              filteredImages.map((img) => (
                <div key={img.id} className="relative group overflow-hidden rounded-3xl shadow-lg aspect-video cursor-pointer">
                  <img 
                    src={img.image_url} 
                    alt={img.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <h4 className="text-white font-bold text-lg">{img.title}</h4>
                    <span className="text-school-accent text-xs uppercase font-bold tracking-widest">{img.category}</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                     <Maximize2 size={20} className="text-white" />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-400 italic">
                No images found in this category.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Gallery;
