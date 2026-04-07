import { clsx, type ClassValue } from 'clsx';
import { TRANSLATIONS } from './data';

export function cn(...inputs: ClassValue[]) {
  return clsx(...inputs);
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(date);
}

export function generateStars(rating: number): string {
  const count = Math.max(0, Math.floor(rating || 0));
  return '★'.repeat(count) + (rating % 1 >= 0.5 ? '½' : '');
}

export function t(key: string, lang: string = 'en'): string {
  const dictionary = (TRANSLATIONS as Record<string, any>)[lang] || TRANSLATIONS.en;
  const keys = key.split('.');
  let value: any = dictionary;
  
  for (const k of keys) {
    if (
      value !== null && 
      typeof value === 'object' && 
      Object.prototype.hasOwnProperty.call(value, k)
    ) {
      value = value[k];
    } else {
      return key; // Fallback to key if path is broken
    }
  }
  
  return value || key;
}
