import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getMonthName(monthNumber) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return monthNames[monthNumber - 1];
}

export function generateHSLColor(index, total) {
  const hue = Math.round((index / total) * 360); // Spread hues across 360 degrees
  const saturation = 70; // Pastel saturation (adjust as needed, lower for paler)
  const lightness = 75; // Pastel lightness (adjust as needed, higher for lighter)
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
