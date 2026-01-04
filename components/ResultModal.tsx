import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle, Info } from 'lucide-react';

export type ResultType = 'success' | 'error' | 'confirm' | 'info';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ResultType;
  title: string;
  message: string;
  onConfirm?: () => void;
}

// Visual styles copied from EventCard for consistency
const darkColorMap: Record<string, string> = {
  emerald: "from-emerald-500/20 to-teal-500/5 border-emerald-500/30 shadow-emerald-500/10",
  pink: "from-pink-500/20 to-rose-500/5 border-pink-500/30 shadow-pink-500/10", // Used for Error
  orange: "from-orange-500/20 to-amber-500/5 border-orange-500/30 shadow-orange-500/10",
  blue: "from-blue-500/20 to-indigo-500/5 border-blue-500/30 shadow-blue-500/10",
};

const lightColorMap: Record<string, string> = {
  emerald: "bg-white border-emerald-200 shadow-emerald-100/50",
  pink: "bg-white border-pink-200 shadow-pink-100/50",
  orange: "bg-white border-orange-200 shadow-orange-100/50",
  blue: "bg-white border-blue-200 shadow-blue-100/50",
};

const iconBgMap: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-600 dark:bg-white/10 dark:text-emerald-200",
  pink: "bg-pink-100 text-pink-600 dark:bg-white/10 dark:text-pink-200",
  orange: "bg-orange-100 text-orange-600 dark:bg-white/10 dark:text-orange-200",
  blue: "bg-blue-100 text-blue-600 dark:bg-white/10 dark:text-blue-200",
};

const ResultModal: React.FC<ResultModalProps> = ({ isOpen, onClose, type, title, message, onConfirm }) => {
  
  // Map ResultType to EventCard color themes
  const getColorKey = (): string => {
    switch (type) {
      case 'success': return 'emerald';
      case 'error': return 'pink';
      case 'confirm': return 'orange';
      default: return 'blue';
    }
  };

  const colorKey = getColorKey();
  const darkClasses = darkColorMap[colorKey];
  const lightClasses = lightColorMap[colorKey];
  const iconStyle = iconBgMap[colorKey];

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 size={32} />;
      case 'error': return <XCircle size={32} />;
      case 'confirm': return <AlertCircle size={32} />;
      default: return <Info size={32} />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success': return 'bg-emerald-500 hover:bg-emerald-600 text-white';
      case 'error': return 'bg-pink-500 hover:bg-pink-600 text-white';
      case 'confirm': return 'bg-orange-500 hover:bg-orange-600 text-white';
      default: return 'bg-blue-500 hover:bg-blue-600 text-white';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={type === 'confirm' ? undefined : onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          
          {/* Modal styled like EventCard */}
          {/* Positioned at top-[320px] to align with the second event slot on mobile */}
          {/* Added x: "-50%" to animate/initial props to ensure horizontal centering works with fixed left-1/2 */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%" }}
            className={`fixed top-[320px] left-1/2 z-[70] 
              w-[calc(100%-3rem)] max-w-sm 
              rounded-2xl border p-5 shadow-xl 
              ${lightClasses} dark:bg-gradient-to-br dark:backdrop-blur-xl ${darkClasses}`}
          >
            <div className="flex flex-col items-center text-center">
              
              <div className={`p-3 rounded-full mb-4 ${iconStyle} shadow-sm`}>
                {getIcon()}
              </div>

              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 drop-shadow-sm">
                {title}
              </h3>
              
              <p className="text-slate-500 dark:text-white/80 mb-6 leading-relaxed text-sm font-medium">
                {message}
              </p>

              <div className="flex gap-3 w-full">
                {type === 'confirm' ? (
                  <>
                    <button
                      onClick={onClose}
                      className="flex-1 py-2.5 px-4 rounded-xl font-bold text-slate-600 dark:text-white/90 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors text-sm"
                    >
                      Annuleren
                    </button>
                    <button
                      onClick={() => {
                        if (onConfirm) onConfirm();
                        onClose();
                      }}
                      className={`flex-1 py-2.5 px-4 rounded-xl font-bold shadow-md transition-all text-sm ${getButtonColor()}`}
                    >
                      Bevestigen
                    </button>
                  </>
                ) : (
                  <button
                    onClick={onClose}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-bold shadow-md transition-all text-sm ${getButtonColor()}`}
                  >
                    Begrepen
                  </button>
                )}
              </div>
            </div>

            {/* Decorative Shine (Dark mode only) - Same as EventCard */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none hidden dark:block" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResultModal;