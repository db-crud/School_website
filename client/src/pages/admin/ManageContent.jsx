import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Save, AlertTriangle, RefreshCw } from 'lucide-react';

const ManageContent = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('home');
  const [saveStatus, setSaveStatus] = useState({});

  useEffect(() => {
    fetchContent();
  }, [activePage]);

  const fetchContent = async () => {
    try {
      const res = await api.get(`/content?page=${activePage}`);
      let data = res.data.data;

      // Initialize home keys if they don't exist
      if (activePage === 'home') {
        const hasStatsKey = data.some(item => item.section_key === 'hero_stat_1');
        const hasWelcomeKey = data.some(item => item.section_key === 'hero_welcome_text');
        const hasWelcomeHeadingKey = data.some(item => item.section_key === 'welcome_heading');
        const hasWhyChooseKey = data.some(item => item.section_key === 'why_choose_heading');

        let defaultHome = [];
        if (!hasStatsKey) {
          defaultHome.push(
            { key: 'hero_stat_1', val: '1500+ Students Enrolled' },
            { key: 'hero_stat_2', val: '50+ Expert Teachers' },
            { key: 'hero_stat_3', val: '25+ Years of Excellence' }
          );
        }
        if (!hasWelcomeKey) {
          defaultHome.push(
            { key: 'hero_welcome_text', val: 'Welcome to Gyanodaya Model Secondary School' },
            { key: 'hero_heading', val: 'Empowering Minds, Structuring Futures' },
            { key: 'hero_description', val: 'A leading institution committed to academic excellence, character building, and holistic development in the heart of Khajura, Banke.' }
          );
        }
        if (!hasWelcomeHeadingKey) {
          defaultHome.push(
            { key: 'welcome_heading', val: 'Welcome to GMSS Khajura' },
            { key: 'welcome_description', val: 'Gyanodaya Model Secondary School stands as a beacon of learning in Khajura, Banke. With a rich history of academic success and a commitment to nurturing the next generation of leaders, we provide a safe, inclusive, and challenging environment for our students.\n\nWe believe in more than just books; we believe in character, creativity, and the courage to change the world. Explore our programs and join our community.' }
          );
        }
        if (!hasWhyChooseKey) {
          defaultHome.push(
            { key: 'why_choose_heading', val: 'Why Choose Us?' },
            { key: 'why_choose_subtitle', val: 'Developing the potential of every student through comprehensive care and quality education.' },
            { key: 'feature_1_title', val: 'Quality Education' },
            { key: 'feature_1_desc', val: 'Modern curriculum\nActive learning approaches\nHolistic development' },
            { key: 'feature_2_title', val: 'Expert Faculty' },
            { key: 'feature_2_desc', val: 'Highly qualified educators\nPassionate teaching\nContinuous mentorship' },
            { key: 'feature_3_title', val: 'Achievements' },
            { key: 'feature_3_desc', val: 'Consistent toppers\nExtra-curricular winners\nSports champions' }
          );
        }

        if (defaultHome.length > 0) {
          for (const item of defaultHome) {
            await api.post('/content', { page_name: 'home', section_key: item.key, section_value: item.val });
          }
          const updatedRes = await api.get(`/content?page=home`);
          data = updatedRes.data.data;
        }
      }

      if (activePage === 'about') {
        const defaultAbout = [
          { key: 'about_banner_title', val: 'About Our School' },
          { key: 'about_banner_subtitle', val: 'Nurturing excellence, character, and leadership since 19XX.' },
          { key: 'about_intro_heading', val: 'Our Legacy & Commitment' },
          { key: 'about_intro_desc_1', val: "Gyanodaya Model Secondary School is more than just an educational institution; it's a platform where dreams take flight. Located in the vibrant community of Khajura, we have been providing high-quality education to students from diverse backgrounds." },
          { key: 'about_intro_desc_2', val: 'Our school is recognized for its academic rigor, disciplined environment, and wide range of co-curricular activities. We focus on holistic development, ensuring that our students are not only academically proficient but also ethically sound and socially responsible.' },
          { key: 'about_est_year', val: '19XX' },
          { key: 'about_mission', val: 'To provide a stimulating learning environment that encourages high expectations for success through development-appropriate instruction that allows for individual differences and learning styles.' },
          { key: 'about_vision', val: 'To be a centre of excellence in education, where students are empowered to meet the challenges of the future while remaining rooted in cultural values and social ethics.' },
          { key: 'about_principal_heading', val: 'Message from the Principal' },
          { key: 'about_principal_subtitle', val: 'Dedicated to Student Success' },
          { key: 'about_principal_desc', val: '"Education is not the learning of facts, but the training of the mind to think."\n\nWe are committed to providing our students with the best possible resources and guidance. Our faculty is dedicated to not just teaching, but mentoring students for life.' },
          { key: 'about_principal_name', val: 'Principal Name' },
          { key: 'about_principal_title', val: 'Principal, GMSS Khajura' },
          { key: 'about_principal_image_url', val: '' },
          { key: 'about_vice_principal_heading', val: 'Message from the Vice Principal' },
          { key: 'about_vice_principal_subtitle', val: 'Fostering Academic Excellence' },
          { key: 'about_vice_principal_desc', val: '"Our goal is to create an environment where every student has the opportunity to excel."\n\nWe believe in a balanced approach to education, combining strong academic foundations with vital extracurricular engagements.' },
          { key: 'about_vice_principal_name', val: 'Vice Principal Name' },
          { key: 'about_vice_principal_title', val: 'Vice Principal, GMSS Khajura' },
          { key: 'about_vice_principal_image_url', val: '' }
        ];

        let madeUpdates = false;
        for (const item of defaultAbout) {
          if (!data.find(d => d.section_key === item.key)) {
            await api.post('/content', { page_name: 'about', section_key: item.key, section_value: item.val });
            madeUpdates = true;
          }
        }
        if (madeUpdates) {
          const updatedRes = await api.get(`/content?page=about`);
          data = updatedRes.data.data;
        }
      }

      if (activePage === 'contact') {
        const defaultContact = [
          { key: 'contact_address', val: 'Khajura, Banke, Nepal' },
          { key: 'contact_phone_1', val: '+977-XX-XXXXXX' },
          { key: 'contact_phone_2', val: '' },
          { key: 'contact_email_1', val: 'info@gmsskhajura.edu.np' },
          { key: 'contact_email_2', val: '' },
          { key: 'contact_map_url', val: 'https://maps.google.com/maps?q=Gyanodaya%20Secondary%20School%20Khajura&t=&z=15&ie=UTF8&iwloc=&output=embed' }
        ];

        let madeUpdates = false;
        for (const item of defaultContact) {
          if (!data.find(d => d.section_key === item.key)) {
            await api.post('/content', { page_name: 'contact', section_key: item.key, section_value: item.val });
            madeUpdates = true;
          }
        }
        if (madeUpdates) {
          const updatedRes = await api.get(`/content?page=contact`);
          data = updatedRes.data.data;
        }
      }

      // Initialize global keys if they don't exist
      if (activePage === 'global' && data.length === 0) {
        const defaultGlobal = [
          { key: 'admission_banner_enabled', val: 'true' },
          { key: 'admission_banner_text', val: '🚀 ADMISSION OPEN FOR NEW ACADEMIC SESSION! JOIN NOW! 🚀' },
          { key: 'popup_notice_enabled', val: 'false' },
          { key: 'popup_notice_image', val: '' },
          { key: 'popup_notice_link', val: '' },
          { key: 'header_message_en', val: 'Hamro Gyanodaya Clean Gyanodaya' },
          { key: 'header_message_np', val: 'हाम्रो ज्ञानोदय स्वच्छ ज्ञानोदय' },
          { key: 'notice_banner_enabled', val: 'false' }
        ];
        for (const item of defaultGlobal) {
          await api.post('/content', { page_name: 'global', section_key: item.key, section_value: item.val });
        }
        const updatedRes = await api.get(`/content?page=global`);
        data = updatedRes.data.data;
      }

      setContent(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleUpdate = async (key, value) => {
    // Optimistic Update: Update local state immediately for instant feedback
    setContent(prev => prev.map(item =>
      item.section_key === key ? { ...item, section_value: value } : item
    ));

    setSaveStatus(prev => ({ ...prev, [key]: 'saving' }));
    try {
      await api.post('/content', { page_name: activePage, section_key: key, section_value: value });
      setSaveStatus(prev => ({ ...prev, [key]: 'saved' }));
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [key]: '' }));
      }, 3000); // clear after 3 seconds
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to save change. Reverting...');
      setSaveStatus(prev => ({ ...prev, [key]: '' }));
      fetchContent(); // Revert to server state on failure
    }
  };

  const handleImageUpload = async (key, file) => {
    if (!file) return;
    setSaveStatus(prev => ({ ...prev, [key]: 'saving' }));
    try {
      const fileData = new FormData();
      fileData.append('file', file);
      const uploadRes = await api.post('/upload', fileData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (uploadRes.data.success) {
        handleUpdate(key, uploadRes.data.url);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      setSaveStatus(prev => ({ ...prev, [key]: '' }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Selector */}
      <div className="flex gap-4 p-2 bg-white rounded-3xl shadow-sm border border-gray-100 self-start inline-flex">
        {['home', 'about', 'academics', 'contact', 'global'].map(p => (
          <button
            key={p}
            onClick={() => setActivePage(p)}
            className={`px-8 py-3 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${activePage === p ? 'bg-school-primary text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="bg-amber-50 border-l-4 border-school-accent p-6 rounded-3xl text-amber-900 flex items-center gap-4">
        <AlertTriangle size={24} className="flex-shrink-0" />
        <p className="text-sm font-medium italic">Changes made here will reflect immediately on the public website. Please review carefully before saving.</p>
      </div>

      <div className="space-y-6">
        {content
          .filter(item => activePage !== 'global' || !item.section_key.startsWith('popup_'))
          .filter(item => !item.section_key.match(/^hero_stat\d+_(num|text)$/))
          .filter(item => !['hero_heading_1', 'hero_heading_2', 'welcome_desc_1', 'welcome_desc_2'].includes(item.section_key))
          .filter(item => !['about_principal_quote', 'about_vice_principal_quote'].includes(item.section_key))
          .sort((a, b) => {
            const keyOrder = {
              'home': ['hero_welcome_text', 'hero_heading', 'hero_description', 'welcome_heading', 'welcome_description', 'why_choose_heading', 'why_choose_subtitle', 'feature_1_title', 'feature_1_desc', 'feature_2_title', 'feature_2_desc', 'feature_3_title', 'feature_3_desc', 'hero_stat_1', 'hero_stat_2', 'hero_stat_3'],
              'about': ['about_banner_title', 'about_banner_subtitle', 'about_intro_heading', 'about_intro_desc_1', 'about_intro_desc_2', 'about_est_year', 'about_mission', 'about_vision', 'about_principal_heading', 'about_principal_subtitle', 'about_principal_desc', 'about_principal_name', 'about_principal_title', 'about_principal_image_url', 'about_vice_principal_heading', 'about_vice_principal_subtitle', 'about_vice_principal_desc', 'about_vice_principal_name', 'about_vice_principal_title', 'about_vice_principal_image_url'],
              'contact': ['contact_address', 'contact_phone_1', 'contact_phone_2', 'contact_email_1', 'contact_email_2', 'contact_map_url']
            };
            const order = keyOrder[activePage] || [];
            const indexA = order.indexOf(a.section_key);
            const indexB = order.indexOf(b.section_key);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.id - b.id;
          })
          .map(item => {
            const isEnabledKey = item.section_key.endsWith('_enabled');
            const isImageUrlKey = item.section_key.endsWith('_image_url');

            return (
              <div key={item.id} className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border-[1px] border-gray-200 group transition-all hover:shadow-md flex flex-col md:flex-row md:items-start gap-3 md:gap-6">
                <div className="md:w-1/3 flex-shrink-0 flex flex-col justify-center h-full">
                  <label className="block text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">
                    Section: {item.section_key.replace(/_/g, ' ')}
                  </label>
                  <h3 className="text-base font-bold text-gray-800 tracking-tight leading-tight mb-2">
                    {item.section_key.startsWith('hero_stat_') ? `Hero Stat ${item.section_key.split('_')[2]}` :
                      item.section_key.startsWith('hero_') ? item.section_key.replace(/_/g, ' ').toUpperCase() :
                        item.section_key.startsWith('welcome_') ? item.section_key.replace(/_/g, ' ').toUpperCase() :
                          item.section_key.startsWith('about_') ? item.section_key.replace(/_/g, ' ').toUpperCase() :
                            item.section_key.startsWith('why_choose') ? item.section_key.replace(/_/g, ' ').toUpperCase() :
                              item.section_key.startsWith('feature_') ? item.section_key.replace(/_/g, ' ').toUpperCase() :
                                item.section_key.startsWith('contact_') ? item.section_key.replace('contact_', 'Contact ').toUpperCase().replace(/_/g, ' ') :
                                  item.section_key.includes('banner') ? (item.section_key.includes('notice') ? 'Notice Marquee Banner' : 'Admission Banner') : item.section_key.includes('popup') ? 'Pop-up Notice' : item.section_key.includes('header_message') ? 'Header Message' : 'General Setting'}
                  </h3>

                  {isEnabledKey && (
                    <div className="flex items-center justify-start gap-3 mt-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${item.section_value === 'true' ? 'text-green-500' : 'text-gray-400'}`}>
                        {item.section_value === 'true' ? 'Enabled' : 'Disabled'}
                      </span>
                      <button
                        onClick={() => handleUpdate(item.section_key, item.section_value === 'true' ? 'false' : 'true')}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${item.section_value === 'true' ? 'bg-school-primary' : 'bg-gray-200'}`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.section_value === 'true' ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  )}

                  {isEnabledKey && (
                    <p className="text-xs text-gray-400 mt-2 font-medium">
                      {item.section_key.includes('admission_banner')
                        ? 'Toggles the scrolling admission banner at the top of the site.'
                        : item.section_key.includes('notice_banner')
                          ? 'Toggles the moving latest notices banner at the top.'
                          : 'Toggles the important notice pop-up when the site first loads.'}
                    </p>
                  )}
                </div>

                {isImageUrlKey && (
                     <div className="flex-1 flex flex-col sm:flex-row gap-4 items-center bg-gray-50 p-4 rounded-2xl w-full border border-dashed border-gray-300 transition-colors hover:border-school-primary">
                        {item.section_value ? (
                           <img src={item.section_value} alt="Preview" className="h-16 w-16 object-cover rounded-xl shadow-sm" />
                        ) : (
                           <div className="h-16 w-16 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-[10px] text-gray-400 font-bold text-center p-1 rounded-sm shadow-sm">No Photo</div>
                        )}
                        <div className="flex-1">
                           <input type="file" accept="image/*" className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-school-primary file:text-white hover:file:bg-school-accent cursor-pointer transition-all focus:outline-none" onChange={(e) => handleImageUpload(item.section_key, e.target.files[0])} />
                           {saveStatus[item.section_key] === 'saving' && <span className="text-xs text-blue-500 ml-2 font-bold animate-pulse">Uploading...</span>}
                           {saveStatus[item.section_key] === 'saved' && <span className="text-xs text-green-500 ml-2 font-bold">Successfully Saved!</span>}
                        </div>
                     </div>
                )}

                {!isEnabledKey && !isImageUrlKey && (
                  <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full">
                    <textarea
                      id={`input-${item.section_key}`}
                      className={`flex-1 bg-gray-50 p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-school-primary transition-all text-gray-700 font-medium ${item.section_key.endsWith('_desc') ? 'h-24 md:h-32' : 'h-14 md:h-16'} resize-y text-sm`}
                      defaultValue={item.section_value}
                      onBlur={(e) => handleUpdate(item.section_key, e.target.value)}
                      placeholder={item.section_key.endsWith('_desc') ? `Enter ${item.section_key.replace(/_/g, ' ')}... (Use New Lines for Bullets)` : `Enter ${item.section_key.replace(/_/g, ' ')} here...`}
                    ></textarea>
                    <div className="sm:w-24 flex flex-col justify-center items-center gap-2">
                      <button
                        onClick={() => handleUpdate(item.section_key, document.getElementById(`input-${item.section_key}`).value)}
                        className={`w-full py-3 rounded-full border-2 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 ${saveStatus[item.section_key] === 'saved' ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-school-primary text-school-primary hover:bg-school-primary hover:text-white'}`}
                      >
                        {saveStatus[item.section_key] === 'saving' ? (
                          <RefreshCw size={14} className="animate-spin" />
                        ) : saveStatus[item.section_key] === 'saved' ? (
                          <span className="font-extrabold tracking-widest uppercase">Saved</span>
                        ) : (
                          <>
                            <Save size={14} /> Save
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

        {content.length === 0 && !loading && (
          <div className="bg-white p-20 rounded-[40px] shadow-sm border border-gray-100 text-center italic text-gray-400">
            No content keys found for "{activePage}" page. Content keys must be initialized in the database.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageContent;
