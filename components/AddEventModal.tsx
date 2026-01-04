import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Sparkles, Save, 
  Calendar as CalendarIcon, Plane, PartyPopper, Cake, Heart, 
  Briefcase, Music, Dumbbell, Star, Home, 
  GraduationCap, Gamepad2, ChevronLeft, ChevronRight
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
  { value: 'calendar', component: CalendarIcon, label: 'Default' },
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

const monthNames = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni",
  "Juli", "Augustus", "September", "Oktober", "November", "December"
];

const dayNames = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onAdd, onEdit, editingEvent }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [selectedColor, setSelectedColor] = useState<ThemeColor>(ThemeColor.Cyan);
  const [selectedIcon, setSelectedIcon] = useState<string>('calendar');
  
  // Custom Calendar State
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());

  useEffect(() => {
    if (isOpen) {
      if (editingEvent) {
        setName(editingEvent.name);
        setDate(editingEvent.date);
        
        // Update calendar view to event date
        const eventDate = new Date(editingEvent.date);
        if (!isNaN(eventDate.getTime())) {
          setViewDate(eventDate);
        }

        const colorExists = colors.some(c => c.value === editingEvent.color);
        setSelectedColor(colorExists ? (editingEvent.color as ThemeColor) : ThemeColor.Cyan);
        setSelectedIcon(editingEvent.icon || 'calendar');
      } else {
        setName('');
        setDate('');
        setViewDate(new Date());
        setSelectedColor(ThemeColor.Cyan);
        setSelectedIcon('calendar');
      }
      setShowCalendar(false);
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

  // Calendar Logic
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    // 0 = Sunday, 1 = Monday... adjust to make Monday 0
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    // Format to YYYY-MM-DD manually to avoid timezone issues
    const year = selected.getFullYear();
    const month = String(selected.getMonth() + 1).padStart(2, '0');
    const dayStr = String(selected.getDate()).padStart(2, '0');
    setDate(`${year}-${month}-${dayStr}`);
    setShowCalendar(false);
  };

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = date === currentDateStr;
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateSelect(day)}
          className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
            isSelected 
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 scale-105' 
              : isToday
                ? 'border-2 border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold'
                : 'text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  // Helper to format displayed date
  const getFormattedDate = () => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
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
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1e293b] border-t border-gray-200 dark:border-white/20 rounded-t-3xl p-6 pb-10 shadow-2xl lg:w-[500px] lg:left-1/2 lg:-translate-x-1/2 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:rounded-2xl transition-colors duration-300 max-h-[90vh] overflow-y-auto"
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

              <div className="space-y-2 relative">
                <label className="text-sm font-medium text-slate-500 dark:text-gray-300 ml-1">Datum</label>
                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className={`w-full flex items-center justify-between bg-slate-50 dark:bg-black/20 border rounded-xl px-4 py-3 text-left transition-all ${
                    showCalendar 
                      ? 'border-cyan-500 ring-1 ring-cyan-500' 
                      : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                  }`}
                >
                  <span className={date ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-gray-500"}>
                    {date ? getFormattedDate() : "Selecteer een datum..."}
                  </span>
                  <CalendarIcon size={18} className="text-slate-400" />
                </button>
                
                {/* Custom Calendar Dropdown */}
                <AnimatePresence>
                  {showCalendar && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      className="overflow-hidden mt-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-4 px-1">
                        <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-gray-300 transition-colors">
                          <ChevronLeft size={20} />
                        </button>
                        <span className="font-bold text-slate-800 dark:text-white">
                          {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                        </span>
                        <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-gray-300 transition-colors">
                          <ChevronRight size={20} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-7 mb-2 text-center">
                        {dayNames.map(day => (
                          <div key={day} className="text-xs font-semibold text-slate-400 dark:text-gray-500 py-1">
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1 place-items-center">
                        {renderCalendar()}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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