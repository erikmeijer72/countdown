export interface EventItem {
  id: string;
  name: string;
  date: string; // ISO string format YYYY-MM-DD
  color: string; // Hex code or Tailwind color class
  icon: string; // Icon name
  createdAt: number;
}

export interface DateDiff {
  days: number;
  isToday: boolean;
  isPast: boolean;
}

export enum ThemeColor {
  Cyan = "cyan",
  Purple = "purple",
  Pink = "pink",
  Orange = "orange",
  Emerald = "emerald",
  Blue = "blue"
}