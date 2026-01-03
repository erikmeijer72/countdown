import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Sparkles, Save, 
  Calendar, Plane, PartyPopper, Cake, Heart, 
  Briefcase, Music, Dumbbell, Star, Home, 
  GraduationCap, Gamepad2 
} from 'lucide-react';
import { ThemeColor, EventItem } from '../types';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, date: string, color: string, icon: string) => void;
  onEdit: (id: string, name: string, date: string, color: string, icon: string) => void;
  editingEvent: EventItem | null;
}

const colors: { value: ThemeColor; label: string; bg: string }[] = [
  { value: ThemeColor.Cyan, label: 'Cyaan', bg: 'bg-cyan-500' },
  { value: ThemeColor.Purple, label: 'Paars', bg: 'bg-purple-500' },
  { value: ThemeColor.Pink, label: 'Roze', bg: 'bg-pink-500' },
  { value: ThemeColor.Orange, label: 'Oranje', bg: 'bg-orange-500' },
  { value: ThemeColor.Emerald, label: 'Smaragd', bg: 'bg-emerald-500' },
  { value: ThemeColor.Blue, label: 'Blauw', bg: 'bg-blue-500' },
];

const icons = [
  { value: 'calendar', component: Calendar, label: 'Default' },
  { value: 'plane', component: Plane, label: 'Reizen' },
  { value: 'party', component: PartyPopper, label: 'Feest' },
  { value: 'cake', component: Cake, label: 'Verjaardag' },
  { value: 'heart', component: Heart, label: 'Liefde' },
  { value: 'star', component: Star, label: 'Speciaal' },
  { value: 'briefcase', component: Briefcase, label: 'Werk' },
  { value: 'grad', component: GraduationCap, label: 'School' },
  { value: 'music', component: Music, label: 'Muziek' },
  { value: 'game', component: Gamepad2, label: 'Gaming' },
  { value: 'dumbbell', component: Dumbbell, label: 'Sport' },
  { value: 'home', component: Home, label: 'Huis' },
];

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onAdd, onEdit, editingEvent }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [selectedColor, setSelectedColor] = useState<ThemeColor>(ThemeColor.Cyan);
  const [selectedIcon, setSelectedIcon] = useState<string>('calendar');

  useEffect(() => {
    if (isOpen) {
      if (editingEvent) {
        setName(editingEvent.name);
        setDate(editingEvent.date);
        const colorExists = colors.some(c => c.value === editingEvent.color);
        setSelectedColor(colorExists ? (editingEvent.color as ThemeColor) : ThemeColor.Cyan);
        setSelectedIcon(editingEvent.icon || 'calendar');
      } else {
        setName('');
        setDate('');
        setSelectedColor(ThemeColor.Cyan);
        setSelectedIcon('calendar');
      }
    }
  }, [isOpen, editingEvent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && date) {
      if (editingEvent) {
        onEdit(editingEvent.id, name, date, selectedColor, selectedIcon);
      } else {
        onAdd(name, date, selectedColor, selectedIcon);
      }
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
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1e293b] border-t border-gray-200 dark:border-white/20 rounded-t-3xl p-6 pb-10 shadow-2xl lg:w-[500px] lg:left-1/2 lg:-translate-x-1/2 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:rounded-2xl transition-colors duration-300"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                {editingEvent ? 'Afteller Bewerken' : 'Nieuwe Afteller'}
              </h2>
              <button onClick={onClose} className="p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-slate-600 dark:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500 dark:text-gray-300 ml-1">Naam evenement</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="bijv. Vakantie Spanje"
                  className="w-full bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500 dark:text-gray-300 ml-1">Datum</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-500 dark:text-gray-300 ml-1">Icoon</label>
                <div className="grid grid-cols-6 gap-2">
                   {icons.map((iconItem) => (
                      <button
                        key={iconItem.value}
                        type="button"
                        onClick={() => setSelectedIcon(iconItem.value)}
                        className={`aspect-square rounded-xl flex items-center justify-center transition-all border ${
                          selectedIcon === iconItem.value
                            ? 'bg-cyan-500 text-white border-cyan-500 dark:bg-white dark:text-slate-900 dark:border-white'
                            : 'bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-gray-400 border-transparent hover:bg-slate-100 dark:hover:bg-white/10'
                        }`}
                        title={iconItem.label}
                      >
                        <iconItem.component size={20} />
                      </button>
                   ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-500 dark:text-gray-300 ml-1">Thema</label>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-10 h-10 rounded-full ${color.bg} flex items-center justify-center transition-all ${
                        selectedColor === color.value 
                          ? 'ring-2 ring-slate-200 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-[#1e293b] scale-110' 
                          : 'opacity-50 hover:opacity-100'
                      }`}
                      aria-label={`Selecteer ${color.label}`}
                    >
                      {selectedColor === color.value && <Sparkles size={14} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!name || !date}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 dark:hover:bg-gray-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
              >
                {editingEvent ? <Save size={20} /> : <Plus size={20} />}
                {editingEvent ? 'Opslaan' : 'Maak Afteller'}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddEventModal;