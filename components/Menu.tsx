import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Upload, Trash2, Moon, Sun, CalendarPlus, Smartphone } from 'lucide-react';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
  onDeleteAll: () => void;
  onAddHolidays: () => void;
  onInstall: () => void;
  canInstall: boolean;
  isDark: boolean;
  toggleTheme: () => void;
  hasEvents: boolean;
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose, onImport, onExport, onDeleteAll, onAddHolidays, onInstall, canInstall, isDark, toggleTheme, hasEvents }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-20 right-6 z-50 w-64 bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 overflow-hidden"
          >
            <div className="p-2 space-y-1">
              
              {/* Install Button - Only visible when browser allows installation */}
              {canInstall && (
                <>
                  <button
                    onClick={() => {
                      onInstall();
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl transition-all shadow-md"
                  >
                    <Smartphone size={18} />
                    App Installeren
                  </button>
                  <div className="h-px bg-gray-200 dark:bg-white/10 my-1" />
                </>
              )}

              <button
                onClick={() => {
                  toggleTheme();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                {isDark ? 'Licht thema' : 'Donker thema'}
              </button>

              <div className="h-px bg-gray-200 dark:bg-white/10 my-1" />

              <button
                onClick={() => {
                  onAddHolidays();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
              >
                <CalendarPlus size={18} />
                Feestdagen NL
              </button>

              <button
                onClick={() => {
                  onExport();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
              >
                <Download size={18} />
                Exporteren
              </button>

              <button
                onClick={handleImportClick}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
              >
                <Upload size={18} />
                Importeren
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={(e) => {
                  onImport(e);
                  onClose();
                }}
                className="hidden"
              />

              <div className="h-px bg-gray-200 dark:bg-white/10 my-1" />

              <button
                onClick={() => {
                  if (hasEvents) {
                    onDeleteAll();
                    // Don't close immediately to allow confirm dialog to show cleanly in parent, 
                    // though parent logic handles closure.
                  }
                }}
                disabled={!hasEvents}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  hasEvents 
                    ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer" 
                    : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                }`}
              >
                <Trash2 size={18} />
                Alles verwijderen
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Menu;