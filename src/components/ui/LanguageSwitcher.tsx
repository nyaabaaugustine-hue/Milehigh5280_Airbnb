'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage, Language } from '@/lib/LanguageContext';

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    // Reduced delay for faster feedback
    const timer = setTimeout(() => setIsVisible(true), 100);

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isMounted) return null;

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <div 
      ref={containerRef}
      className={`fixed bottom-32 left-6 z-[9999] transition-all duration-700 ease-out transform lg:hidden ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="bg-[#0a0a0a] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl p-4 w-64 flex items-center justify-between hover:bg-stone-900 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-base">
              {currentLang.flag}
            </div>
            <div className="text-left">
              <p className="text-[9px] text-stone-500 uppercase font-bold tracking-widest">Language</p>
              <p className="text-xs font-bold text-stone-200">{currentLang.label}</p>
            </div>
          </div>
          <svg 
            className={`w-4 h-4 text-stone-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div role="listbox" className="absolute bottom-full mb-3 left-0 w-64 max-h-[60vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 scrollbar-hide">
            <div className="p-2 space-y-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setLanguage(lang.code as Language);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    language === lang.code 
                      ? 'bg-white/10 text-stone-200' 
                      : 'text-stone-400 hover:bg-white/5 hover:text-stone-200'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-bold">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
