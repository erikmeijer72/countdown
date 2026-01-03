import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { EventItem } from '../types';
import { calculateDaysLeft, formatDate } from '../utils/time';

interface EventCardProps {
  event: EventItem;
  onDelete: (id: string) => void;
  index: number;
}

const colorMap: Record<string, string> = {
  cyan: "from-cyan-500/20 to-blue-500/5 border-cyan-500/30 shadow-cyan-500/10",
  purple: "from-purple-500/20 to-pink-500/5 border-purple-500/30 shadow-purple-500/10",
  pink: "from-pink-500/20 to-rose-500/5 border-pink-500/30 shadow-pink-500/10",
  orange: "from-orange-500/20 to-amber-500/5 border-orange-500/30 shadow-orange-500/10",
  emerald: "from-emerald-500/20 to-teal-500/5 border-emerald-500/30 shadow-emerald-500/10",
  blue: "from-blue-500/20 to-indigo-500/5 border-blue-500/30 shadow-blue-500/10",
};

const textMap: Record<string, string> = {
  cyan: "text-cyan-400",
  purple: "text-purple-400",
  pink: "text-pink-400",
  orange: "text-orange-400",
  emerald: "text-emerald-400",
  blue: "text-blue-400",
};

const EventCard: React.FC<EventCardProps> = ({ event, onDelete, index }) => {
  const { days, isToday, isPast } = calculateDaysLeft(event.date);
  
  const themeClasses = colorMap[event.color] || colorMap.cyan;
  const textClass = textMap[event.color] || textMap.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative group overflow-hidden rounded-2xl border backdrop-blur-xl bg-gradient-to-br ${themeClasses} shadow-lg hover:shadow-2xl transition-all duration-300 p-5`}
    >
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 opacity-70">
            <Calendar size={14} className="text-gray-300" />
            <span className="text-xs font-medium tracking-wide text-gray-300 uppercase">{formatDate(event.date)}</span>
          </div>
          <h3 className="text-xl font-bold text-white truncate pr-4">{event.name}</h3>
        </div>
        
        <button
          onClick={() => onDelete(event.id)}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Delete event"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="mt-6 flex items-baseline gap-1">
        {isPast ? (
            <div className="flex items-center gap-2 text-gray-400">
               <CheckCircle2 size={32} />
               <span className="text-2xl font-bold">Done</span>
            </div>
        ) : isToday ? (
            <div className="flex items-center gap-2 text-red-500 animate-pulse">
                <AlertCircle size={32} />
                <span className="text-2xl font-bold">Today!</span>
            </div>
        ) : (
            <>
                <span className={`text-5xl font-extrabold tracking-tighter ${textClass} drop-shadow-md`}>
                {days}
                </span>
                <span className="text-sm font-medium text-white/60 ml-1">days left</span>
            </>
        )}
      </div>
      
      {/* Decorative Shine */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none" />
    </motion.div>
  );
};

export default EventCard;