import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Sparkles, RefreshCw, AlertCircle, Camera, 
  CheckCircle, Info, Bookmark, History, Menu, X, 
  Layers, Palette, Thermometer, Maximize, Filter,
  User, Crop, Scissors, Eye, Printer, ShieldCheck,
  ChevronRight, Ruler, Target
} from 'lucide-react';
import API_URL from '../config/api';

const API_BASE = `${API_URL}/api/ai`;

const extractHex = (str) => {
  const match = str.match(/#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})/);
  return match ? match[0] : '#A0522D'; 
};

const MetricGauge = ({ label, value, percentage, icon: Icon }) => (
  <div className="glass-card p-6 flex flex-col justify-between border-stone-200/60 shadow-sm hover:shadow-md transition-all duration-500">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-[#A0522D]" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">{label}</span>
      </div>
      <span className="text-[10px] font-bold text-[#3E2723] bg-stone-100 px-3 py-1 rounded-full border border-stone-200">{value}</span>
    </div>
    <div className="bg-stone-100 h-1.5 w-full rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }} 
        animate={{ width: `${percentage}%` }} 
        transition={{ duration: 1.5, ease: "easeOut" }} 
        className="h-full bg-gradient-to-r from-[#A0522D] to-[#D2691E]" 
      />
    </div>
  </div>
);

const CircularDial = ({ percentage, label, sublabel }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-[2.5rem] border border-stone-100 shadow-sm min-w-[200px]">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 144 144" className="w-full h-full transform -rotate-90">
          <circle
            cx="72" cy="72" r={radius}
            stroke="currentColor" strokeWidth="6" fill="transparent"
            className="text-stone-100"
          />
          <motion.circle
            cx="72" cy="72" r={radius}
            stroke="currentColor" strokeWidth="8" fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut" }}
            strokeLinecap="round"
            className="text-[#A0522D]"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-[#3E2723]">{percentage}%</span>
          <span className="text-[8px] font-bold uppercase tracking-widest text-stone-400">Match</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3E2723]">{label}</p>
        <p className="text-[9px] text-stone-400 font-medium italic mt-1">{sublabel}</p>
      </div>
    </div>
  );
};

const AIMirror = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('palette');
  
  // Custom Inputs
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [purpose, setPurpose] = useState('Casual');

  // Auditor State
  const [auditorOpen, setAuditorOpen] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('ai_stylist_last_result');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.face_analysis) {
        setResults(parsed);
      }
    }
  }, []);

  const handleAnalyze = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImage(file);
    setLoading(true); 
    setError(null);
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('height', height);
    formData.append('width', width);
    formData.append('purpose', purpose);

    try {
      const response = await axios.post(`${API_BASE}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResults(response.data);
      localStorage.setItem('ai_stylist_last_result', JSON.stringify(response.data));
    } catch (err) { 
      setError("AI Analysis failed. Please check if the server is running.");
      console.error(err);
    } finally { 
      setLoading(false); 
    }
  };

  const handleAudit = async (e) => {
    const file = e.target.files[0];
    if (!file || !results) return;
    
    setAuditLoading(true); 
    setAuditResult(null);
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('skin_tone', results.analysis.skin_tone);
    formData.append('undertone', results.analysis.undertone);
    
    try {
      const resp = await axios.post(`${API_BASE}/audit`, formData);
      setAuditResult(resp.data);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setAuditLoading(false); 
    }
  };

  const filteredOutfits = results?.outfit_recommendations?.filter(o => {
    if (filter === 'all') return true;
    if (filter === 'best') return o.tag === 'best';
    return o.occasion.toLowerCase().includes(filter.toLowerCase());
  }) || [];

  return (
    <div className="page-container bg-[#FAF9F6] min-h-screen pt-24 pb-12 px-6 lg:px-12 font-['Inter',sans-serif]">
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-[#3E2723] mb-4">
              AI<span className="text-[#A0522D]"> MIRROR</span>
            </h1>
            <p className="text-stone-500 uppercase tracking-[0.4em] text-[10px] font-bold">
              Neural Styling Architecture &bull; v2.5
            </p>
          </motion.div>
        </header>

        {/* Dashboard Content */}
        {!results ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 section-fade-in">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-[#3E2723]">Define Your Profile</h2>
                <p className="text-stone-600 leading-relaxed max-w-md">
                  Upload a portrait to initialize the stylists matrix. Our AI will analyze your features and measurements to curate the perfect wardrobe.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#A0522D] flex items-center gap-2">
                    <Ruler size={14} /> Height
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. 180cm" 
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-white border border-stone-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#A0522D]/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#A0522D] flex items-center gap-2">
                    <Maximize size={14} /> Width / Build
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Athletic" 
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full bg-white border border-stone-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#A0522D]/20 outline-none transition-all"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#A0522D] flex items-center gap-2">
                    <Target size={14} /> Occasion Purpose
                  </label>
                  <select 
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full bg-white border border-stone-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#A0522D]/20 outline-none transition-all appearance-none"
                  >
                    <option>Casual</option>
                    <option>Formal</option>
                    <option>Smart Casual</option>
                    <option>Date Night</option>
                    <option>Wedding</option>
                    <option>Business Professional</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <input type="file" id="portraitUpload" className="hidden" onChange={handleAnalyze} />
                <label 
                  htmlFor="portraitUpload" 
                  className={`flex items-center justify-center gap-3 px-8 py-4 bg-[#3E2723] text-white rounded-full font-bold text-sm tracking-widest uppercase cursor-pointer hover:bg-[#A0522D] transition-all shadow-lg hover:shadow-xl ${loading ? 'opacity-70 pointer-events-none' : ''}`}
                >
                  {loading ? <RefreshCw className="animate-spin" size={18} /> : <Camera size={18} />}
                  {loading ? 'Analyzing Neural Data...' : 'Begin Analysis'}
                </label>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
            </div>

            <div className="relative group">
              <div className="aspect-[4/5] bg-stone-200 rounded-[2.5rem] overflow-hidden shadow-2xl flex items-center justify-center">
                 {loading ? (
                   <div className="flex flex-col items-center gap-4">
                     <div className="w-16 h-16 border-4 border-[#A0522D] border-t-transparent rounded-full animate-spin"></div>
                     <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Scanning Bio-metrics</span>
                   </div>
                 ) : (
                   <div className="text-center p-12 transition-transform duration-700 group-hover:scale-105">
                     <Camera size={64} className="mx-auto text-stone-400 mb-6" />
                     <p className="text-stone-500 font-medium">No Image Uploaded</p>
                   </div>
                 )}
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#A0522D]/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-stone-200/50 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
               <MetricGauge label="Tone Signature" value={results.analysis.skin_tone} percentage={75} icon={User} />
               <MetricGauge label="Undertone" value={results.analysis.undertone} percentage={85} icon={Thermometer} />
               <MetricGauge label="Body Profile" value={results.analysis.body_shape || "Athletic"} percentage={90} icon={Maximize} />
               <button 
                 onClick={() => setAuditorOpen(true)}
                 className="glass-card p-6 flex items-center justify-between group hover:bg-[#3E2723] transition-all duration-300 border- stone-200/60"
               >
                 <div className="flex items-center gap-3">
                   <ShieldCheck size={24} className="text-[#A0522D] group-hover:text-white" />
                   <div className="text-left">
                     <p className="text-[10px] font-bold text-stone-500 uppercase group-hover:text-stone-300">Garment</p>
                     <p className="text-sm font-bold text-[#3E2723] group-hover:text-white">Auditor Tool</p>
                   </div>
                 </div>
                 <ChevronRight size={18} className="text-stone-400 group-hover:text-white" />
               </button>
            </div>

            {/* Tab Selection */}
            <div className="flex justify-center gap-10 border-b border-stone-200">
               {['palette', 'intelligence'].map(tab => (
                 <button 
                   key={tab} 
                   className={`pb-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? 'text-[#A0522D]' : 'text-stone-400 hover:text-stone-600'}`}
                   onClick={() => setActiveTab(tab)}
                 >
                   {tab === 'palette' ? 'Wardrobe Matrix' : 'Structural Intel'}
                   {activeTab === tab && (
                     <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A0522D]" />
                   )}
                 </button>
               ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {activeTab === 'palette' ? (
                  <div className="lg:col-span-12 space-y-12 animate-in">
                    
                    {/* Compact Dial & Palette Group */}
                    <div className="flex flex-col md:flex-row gap-6 items-stretch mb-10 mt-6">
                      <div className="flex-shrink-0">
                        <CircularDial 
                          percentage={94} 
                          label="Stylist Confidence" 
                          sublabel="Match affinity score" 
                        />
                      </div>
                      
                      <div className="flex-grow bg-white rounded-[2.5rem] border border-stone-100 p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
                        <div className="text-left md:w-32 flex-shrink-0">
                          <h3 className="text-xl font-bold text-[#3E2723] flex items-center gap-2 mb-1">
                             <Palette className="text-[#A0522D]" size={20} />
                             Palette
                          </h3>
                          <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest leading-tight">Spectral Matrix Matrix</p>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-3">
                           {results.recommended_colors.primary.concat(results.recommended_colors.secondary).slice(0, 8).map((c, i) => (
                             <div key={i} className="swatch-group relative">
                                <div 
                                  className="w-10 h-10 rounded-xl shadow-inner border border-stone-200/60 cursor-help transition-all hover:scale-110 duration-300"
                                  style={{ background: extractHex(c) || '#A0522D' }}
                                ></div>
                                <div className="swatch-tooltip absolute -top-8 left-1/2 -translate-x-1/2 bg-[#3E2723] text-white text-[7px] px-2 py-0.5 rounded opacity-0 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                  {c.split('(')[0].trim()}
                                </div>
                             </div>
                           ))}
                        </div>

                        <div className="hidden lg:block h-10 w-px bg-stone-100 mx-2"></div>

                        <div className="flex flex-wrap gap-1.5 grow justify-center md:justify-end max-w-[200px]">
                           {results.avoid_colors.slice(0, 4).map((c, i) => (
                             <span key={i} className="px-2 py-1 bg-red-50 text-red-500 text-[7px] font-black uppercase rounded-lg border border-red-100 flex items-center gap-1">
                               <div className="w-1 h-1 rounded-full bg-red-500"></div>
                               {c}
                             </span>
                           ))}
                        </div>
                      </div>
                    </div>

                    {/* Main Suggestions Grid */}
                    <div className="space-y-8">
                      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                          <h3 className="text-3xl font-bold text-[#3E2723] flex items-center gap-3">
                            <Sparkles className="text-[#A0522D]" size={28} />
                            Curated Lookbook
                          </h3>
                          <p className="text-stone-500 text-sm">Occasion-specific pairings for your profile</p>
                        </div>
                        <div className="flex gap-2 p-1 bg-stone-100 rounded-full">
                          {['all', 'best', 'Casual', 'Formal'].map(f => (
                            <button 
                              key={f} 
                              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-[#A0522D] shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                              onClick={() => setFilter(f)}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOutfits.map((o, idx) => (
                          <motion.div 
                            key={o.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col justify-between min-h-[22rem]"
                          >
                             <div className="space-y-6">
                               <div className="flex justify-between items-start">
                                 <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                   o.tag === 'best' ? 'bg-orange-50 text-[#A0522D] border-orange-200' : 
                                   o.tag === 'avoid' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-stone-50 text-stone-500 border-stone-100'
                                 }`}>
                                   {o.tag === 'best' ? '🔥 Top Signature Match' : o.tag === 'good' ? 'Recommended' : 'Clash Hazard'}
                                 </span>
                                 <CheckCircle size={18} className="text-stone-300 group-hover:text-[#A0522D] transition-colors" />
                               </div>
                               
                               <div>
                                 <h4 className="text-2xl font-bold text-[#3E2723] leading-tight mb-2">
                                   {o.combination.top} + {o.combination.bottom}
                                 </h4>
                                 {o.combination.layer !== 'None' && (
                                   <p className="text-stone-400 text-xs flex items-center gap-2">
                                     <Layers size={12} /> Styled with {o.combination.layer}
                                   </p>
                                 )}
                               </div>

                               <p className="text-stone-500 text-sm italic leading-relaxed">
                                 {o.rationale}
                               </p>
                             </div>

                             <div className="pt-6 border-t border-stone-100 flex justify-between items-center mt-6">
                               <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{o.occasion}</span>
                               <div className="text-[10px] font-bold text-[#A0522D]">{o.match_score}% Confidence</div>
                             </div>
                          </motion.div>
                        ))}

                        <div className="bg-stone-100/50 p-8 rounded-[2rem] border border-dashed border-stone-200 flex flex-col items-center justify-center text-center space-y-4 hover:border-[#A0522D] transition-all group">
                           <button 
                             className="p-4 bg-white rounded-full shadow-md text-[#A0522D] group-hover:bg-[#A0522D] group-hover:text-white transition-all"
                             onClick={() => {
                               setImage(null);
                               setResults(null);
                             }}
                           >
                             <RefreshCw size={24} />
                           </button>
                           <div>
                             <p className="text-sm font-bold text-[#3E2723]">New Analysis</p>
                             <p className="text-[10px] text-stone-400 uppercase tracking-widest">Resetstylist Matrix</p>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
               ) : (
                 <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in">
                    <div className="glass-card p-12 flex flex-col items-center text-center space-y-8">
                       <div className="w-48 h-48 bg-stone-100 rounded-full flex items-center justify-center border-4 border-[#A0522D]/10 overflow-hidden relative group">
                          {image ? <img src={URL.createObjectURL(image)} className="w-full h-full object-cover opacity-80" alt="profile" /> : <User size={80} className="text-[#A0522D]/20" />}
                          <div className="absolute inset-0 bg-[#A0522D]/10 mix-blend-overlay"></div>
                       </div>
                       <div>
                         <h3 className="text-4xl font-black text-[#3E2723] mb-2">{results.face_analysis?.face_shape || "Balanced"}</h3>
                         <p className="text-stone-400 font-bold tracking-widest uppercase text-[10px]">Detected Facial Geometry</p>
                       </div>
                       <div className="w-full p-6 bg-stone-50 rounded-2xl border border-stone-100 text-left">
                         <p className="text-stone-600 leading-relaxed italic text-sm">
                           "A balanced geometry with soft transitions. Focus on angular accessories like rectangular frames to add definition to your silhouette. Your profile suggests a strong affinity for high-contrast combinations."
                         </p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="glass-card p-8">
                         <h3 className="text-lg font-bold text-[#3E2723] mb-6 flex items-center gap-3">
                           <Scissors className="text-[#A0522D]" size={18} /> Hairstyle Logic
                         </h3>
                         <div className="space-y-3">
                            {results.face_analysis?.hairstyle_recommendations?.map((h, i) => (
                              <div key={i} className="p-4 bg-stone-50 rounded-xl flex items-center gap-4 hover:bg-stone-100 transition-colors cursor-default">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#A0522D]"></div>
                                <p className="font-bold text-stone-700 text-sm">{h}</p>
                              </div>
                            ))}
                         </div>
                       </div>
                       
                       <div className="glass-card p-8">
                         <h3 className="text-lg font-bold text-[#3E2723] mb-6 flex items-center gap-3">
                           <Eye className="text-[#A0522D]" size={18} /> Framed Intelligence
                         </h3>
                         <div className="flex flex-wrap gap-3">
                            {results.face_analysis?.eyewear_recommendations?.map((e, i) => (
                              <span key={i} className="px-5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-[#3E2723] text-xs hover:border-[#A0522D] transition-all cursor-default">
                                {e}
                              </span>
                            ))}
                         </div>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          </motion.div>
        )}

        {/* Auditor Modal */}
        <AnimatePresence>
          {auditorOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 sm:p-12">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setAuditorOpen(false)}
                 className="absolute inset-0 bg-[#3E2723]/40 backdrop-blur-md"
               />
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                 animate={{ scale: 1, opacity: 1, y: 0 }} 
                 exit={{ scale: 0.9, opacity: 0, y: 20 }}
                 className="bg-white p-10 sm:p-14 max-w-xl w-full relative rounded-[3rem] shadow-2xl z-10"
               >
                  <button 
                    className="absolute top-8 right-8 text-stone-400 hover:text-stone-600 transition-colors"
                    onClick={() => setAuditorOpen(false)}
                  >
                    <X size={24} />
                  </button>
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-[#A0522D]/10 rounded-2xl">
                      <ShieldCheck className="text-[#A0522D]" size={28} />
                    </div>
                    <h2 className="text-3xl font-bold text-[#3E2723]">Garment Auditor</h2>
                  </div>
                  
                  <p className="text-stone-500 mb-10 leading-relaxed">
                    Capture or upload a piece of clothing to verify its compatibility with your **{results?.analysis.skin_tone}** profile.
                  </p>
                  
                  {!auditResult ? (
                    <div className="p-12 border-2 border-dashed border-stone-200 rounded-[2rem] text-center hover:border-[#A0522D] transition-all group">
                       {auditLoading ? (
                         <div className="space-y-4">
                           <RefreshCw className="animate-spin mx-auto text-[#A0522D]" size={40} />
                           <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Spectral Analysis in progress...</p>
                         </div>
                       ) : (
                         <div className="space-y-6">
                           <Crop className="mx-auto text-stone-300 group-hover:text-[#A0522D] transition-colors" size={48} />
                           <input type="file" id="auditInput" className="hidden" onChange={handleAudit} />
                           <label htmlFor="auditInput" className="inline-block px-8 py-3 bg-[#3E2723] text-white text-[10px] font-bold uppercase tracking-widest rounded-full cursor-pointer hover:bg-[#A0522D] transition-all">
                             Select Fabric Capture
                           </label>
                         </div>
                       )}
                    </div>
                  ) : (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-8">
                       <div className={`p-8 rounded-3xl border-2 text-center transition-all ${
                         auditResult.status === 'clash' ? 'bg-red-50 border-red-100 text-red-500' : 'bg-green-50 border-green-100 text-green-600'
                       }`}>
                          <h4 className="text-4xl font-black uppercase mb-1 tracking-tight">{auditResult.status}</h4>
                          <p className="text-[10px] font-bold uppercase opacity-60">{auditResult.match_score}% Profile Affinity</p>
                       </div>
                       <p className="text-lg italic text-[#3E2723] leading-relaxed text-center font-medium">
                         "{auditResult.recommendation}"
                       </p>
                       <button 
                         className="w-full py-4 bg-stone-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:bg-[#3E2723] hover:text-white transition-all shadow-sm" 
                         onClick={() => setAuditResult(null)}
                       >
                         Perform New Audit
                       </button>
                    </motion.div>
                  )}
               </motion.div>
            </div>
          )}
        </AnimatePresence>

        <footer className="mt-24 pt-12 border-t border-stone-200 text-center">
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.8em]">AR-Y-TRY Neural Intelligence Engine &bull; Est. 2026</p>
        </footer>
      </div>

      <style>{`
        .glass-card {
          background: white;
          border-radius: 2rem;
          border: 1px solid rgba(231, 229, 228, 0.6);
        }
        
        .page-container {
          overflow-x: hidden;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #FAF9F6;
        }
        ::-webkit-scrollbar-thumb {
          background: #E7E5E4;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #A0522D;
        }

        .swatch-group:hover .swatch-tooltip {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default AIMirror;
