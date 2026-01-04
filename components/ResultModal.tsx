import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle, Info, X } from 'lucide-react';

export type ResultType = 'success' | 'error' | 'confirm' | 'info';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ResultType;
  title: string;
  message: string;
  onConfirm?: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ isOpen, onClose, type, title, message, onConfirm }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={48} className="text-emerald-500" />;
      case 'error':
        return <XCircle size={48} className="text-red-500" />;
      case 'confirm':
        return <AlertCircle size={48} className="text-orange-500" />;
      default:
        return <Info size={48} className="text-blue-500" />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success': return 'bg-emerald-500 hover:bg-emerald-600';
      case 'error': return 'bg-red-500 hover:bg-red-600';
      case 'confirm': return 'bg-orange-500 hover:bg-orange-600';
      default: return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={type === 'confirm' ? undefined : onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[90%] max-w-sm bg-white dark:bg-[#1e293b] rounded-3xl p-6 shadow-2xl border border-white/20 dark:border-white/10 text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 shadow-inner">
                {getIcon()}
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              {title}
            </h3>
            
            <p className="text-slate-500 dark:text-gray-300 mb-8 leading-relaxed">
              {message}
            </p>

            <div className="flex gap-3">
              {type === 'confirm' ? (
                <>
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-600 dark:text-gray-300 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                  >
                    Annuleren
                  </button>
                  <button
                    onClick={() => {
                      if (onConfirm) onConfirm();
                      onClose();
                    }}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white shadow-lg shadow-orange-500/20 transition-all ${getButtonColor()}`}
                  >
                    Bevestigen
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white shadow-lg transition-all ${getButtonColor()}`}
                >
                  Begrepen
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResultModal;