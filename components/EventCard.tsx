import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Trash2, AlertCircle, CheckCircle2, Pencil, 
  Plane, PartyPopper, Cake, Heart, Briefcase, Music, 
  Dumbbell, Star, Home, GraduationCap, Gamepad2
} from 'lucide-react';
import { EventItem } from '../types';
import { calculateDaysLeft, formatDate } from '../utils/time';

interface EventCardProps {
  event: EventItem;
  onDelete: (id: string) => void;
  onEdit: (event: EventItem) => void;
  index: number;
}

// Dark mode gradients
const darkColorMap: Record<string, string> = {
  cyan: "from-cyan-500/20 to-blue-500/5 border-cyan-500/30 shadow-cyan-500/10",
  purple: "from-purple-500/20 to-pink-500/5 border-purple-500/30 shadow-purple-500/10",
  pink: "from-pink-500/20 to-rose-500/5 border-pink-500/30 shadow-pink-500/10",
  orange: "from-orange-500/20 to-amber-500/5 border-orange-500/30 shadow-orange-500/10",
  emerald: "from-emerald-500/20 to-teal-500/5 border-emerald-500/30 shadow-emerald-500/10",
  blue: "from-blue-500/20 to-indigo-500/5 border-blue-500/30 shadow-blue-500/10",
};

// Light mode classes (cleaner look)
const lightColorMap: Record<string, string> = {
  cyan: "bg-white border-cyan-200 shadow-cyan-100/50",
  purple: "bg-white border-purple-200 shadow-purple-100/50",
  pink: "bg-white border-pink-200 shadow-pink-100/50",
  orange: "bg-white border-orange-200 shadow-orange-100/50",
  emerald: "bg-white border-emerald-200 shadow-emerald-100/50",
  blue: "bg-white border-blue-200 shadow-blue-100/50",
};

const iconBgMap: Record<string, string> = {
  cyan: "bg-cyan-100 text-cyan-600 dark:bg-white/10 dark:text-cyan-200",
  purple: "bg-purple-100 text-purple-600 dark:bg-white/10 dark:text-purple-200",
  pink: "bg-pink-100 text-pink-600 dark:bg-white/10 dark:text-pink-200",
  orange: "bg-orange-100 text-orange-600 dark:bg-white/10 dark:text-orange-200",
  emerald: "bg-emerald-100 text-emerald-600 dark:bg-white/10 dark:text-emerald-200",
  blue: "bg-blue-100 text-blue-600 dark:bg-white/10 dark:text-blue-200",
};

const iconMap: Record<string, React.ComponentType<any>> = {
  calendar: Calendar,
  plane: Plane,
  party: PartyPopper,
  cake: Cake,
  heart: Heart,
  briefcase: Briefcase,
  music: Music,
  dumbbell: Dumbbell,
  star: Star,
  home: Home,
  grad: GraduationCap,
  game: Gamepad2
};

const EventCard: React.FC<EventCardProps> = ({ event, onDelete, onEdit, index }) => {
  const { days, isToday, isPast } = calculateDaysLeft(event.date);
  
  const darkClasses = darkColorMap[event.color] || darkColorMap.cyan;
  const lightClasses = lightColorMap[event.color] || lightColorMap.cyan;
  const iconStyle = iconBgMap[event.color] || iconBgMap.cyan;
  
  // Default to Calendar if icon is missing or invalid
  const IconComponent = iconMap[event.icon] || Calendar;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative group overflow-hidden rounded-2xl border transition-all duration-300 p-5 shadow-lg hover:shadow-xl ${lightClasses} dark:bg-gradient-to-br dark:backdrop-blur-xl ${darkClasses}`}
    >
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 opacity-90">
            <div className={`p-1.5 rounded-lg ${iconStyle} transition-colors`}>
              <IconComponent size={14} />
            </div>
            <span className="text-xs font-bold tracking-wide text-slate-500 dark:text-white/80 uppercase">{formatDate(event.date)}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white truncate pr-4 drop-shadow-sm">{event.name}</h3>
        </div>
        
        <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(event)}
              className="p-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-white transition-colors"
              aria-label="Bewerk evenement"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(event.id)}
              className="p-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-white hover:text-red-500 dark:hover:text-red-300 transition-colors"
              aria-label="Verwijder evenement"
            >
              <Trash2 size={16} />
            </button>
        </div>
      </div>

      <div className="mt-6 flex items-baseline gap-1">
        {isPast ? (
            <div className="flex items-center gap-2 text-slate-400 dark:text-white/60">
               <CheckCircle2 size={32} />
               <span className="text-2xl font-bold">Voorbij</span>
            </div>
        ) : isToday ? (
            <div className="flex items-center gap-2 text-red-500 dark:text-white animate-pulse">
                <AlertCircle size={32} />
                <span className="text-2xl font-bold">Vandaag!</span>
            </div>
        ) : (
            <>
                <span className={`text-5xl font-extrabold tracking-tighter text-slate-800 dark:text-white drop-shadow-md`}>
                {days}
                </span>
                <span className="text-sm font-medium text-slate-500 dark:text-white/80 ml-1">dagen te gaan</span>
            </>
        )}
      </div>
      
      {/* Decorative Shine (Dark mode only) */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none hidden dark:block" />
    </motion.div>
  );
};

export default EventCard;