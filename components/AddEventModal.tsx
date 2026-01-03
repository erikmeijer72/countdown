import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Sparkles } from 'lucide-react';
import { ThemeColor } from '../types';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, date: string, color: string) => void;
}

const colors: { value: ThemeColor; label: string; bg: string }[] = [
  { value: ThemeColor.Cyan, label: 'Cyan', bg: 'bg-cyan-500' },
  { value: ThemeColor.Purple, label: 'Purple', bg: 'bg-purple-500' },
  { value: ThemeColor.Pink, label: 'Pink', bg: 'bg-pink-500' },
  { value: ThemeColor.Orange, label: 'Orange', bg: 'bg-orange-500' },
  { value: ThemeColor.Emerald, label: 'Emerald', bg: 'bg-emerald-500' },
  { value: ThemeColor.Blue, label: 'Blue', bg: 'bg-blue-500' },
];

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [selectedColor, setSelectedColor] = useState<ThemeColor>(ThemeColor.Cyan);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && date) {
      onAdd(name, date, selectedColor);
      setName('');
      setDate('');
      setSelectedColor(ThemeColor.Cyan);
      onClose();
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
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#161b22] border-t border-white/10 rounded-t-3xl p-6 pb-10 shadow-2xl lg:w-[500px] lg:left-1/2 lg:-translate-x-1/2 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:rounded-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                New Countdown
              </h2>
              <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Event Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Trip to Tokyo"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Target Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all [color-scheme:dark]"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-400 ml-1">Theme</label>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-10 h-10 rounded-full ${color.bg} flex items-center justify-center transition-all ${
                        selectedColor === color.value 
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-[#161b22] scale-110' 
                          : 'opacity-50 hover:opacity-80'
                      }`}
                      aria-label={`Select ${color.label}`}
                    >
                      {selectedColor === color.value && <Sparkles size={14} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!name || !date}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-cyan-900/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
              >
                <Plus size={20} />
                Create Countdown
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddEventModal;