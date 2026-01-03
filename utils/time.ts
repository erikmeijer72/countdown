import { DateDiff } from '../types';

export const calculateDaysLeft = (targetDate: string): DateDiff => {
  const now = new Date();
  const target = new Date(targetDate);
  
  // Reset hours to compare dates strictly
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    days: Math.abs(diffDays),
    isToday: diffDays === 0,
    isPast: diffDays < 0
  };
};

export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const getRelativeColor = (diff: DateDiff, baseColor: string): string => {
  if (diff.isPast) return "text-gray-500";
  if (diff.isToday) return "text-red-500 animate-pulse";
  if (diff.days <= 3) return "text-red-400";
  if (diff.days <= 7) return "text-orange-400";
  return `text-${baseColor}-400`; // Relies on safelisting or inline styles if dynamic
};