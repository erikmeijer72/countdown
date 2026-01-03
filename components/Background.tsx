import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 bg-slate-50 dark:bg-[#1e293b] transition-colors duration-500">
      {/* Dark Mode Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#475569] to-[#1e293b] opacity-0 dark:opacity-100 transition-opacity duration-500" />
      
      {/* Light Mode Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-slate-50 to-white opacity-100 dark:opacity-0 transition-opacity duration-500" />
      
      {/* Animated Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400/30 dark:bg-purple-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] dark:blur-[100px] opacity-60 animate-blob" />
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyan-400/30 dark:bg-cyan-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] dark:blur-[100px] opacity-60 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-400/30 dark:bg-pink-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] dark:blur-[100px] opacity-60 animate-blob animation-delay-4000" />
      
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
    </div>
  );
};

export default Background;