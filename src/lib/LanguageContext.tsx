'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Script from 'next/script';

export type Language = 'en' | 'fr' | 'es' | 'de' | 'zh' | 'ar' | 'pt' | 'ja' | 'ru' | 'it' | 'ko' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('preferred-lang') as Language;
    if (saved) {
      setLanguage(saved);
      setCookie('googtrans', `/en/${saved}`);
    }

    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement({
        pageLanguage: 'en',
        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      }, 'google_translate_element');
    };
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('preferred-lang', lang);
    setCookie('googtrans', `/en/${lang}`);
    
    // Check if google translate is initialized
    if ((window as any).google && (window as any).google.translate) {
      // Find the google translate select element if it exists and trigger it
      // However, most reliable way with the widget is still cookie + reload
      // especially for App Router state.
      window.location.reload();
    } else {
      window.location.reload();
    }
  };

  const setCookie = (name: string, value: string) => {
    const domain = window.location.hostname !== 'localhost' ? `domain=${window.location.hostname};` : '';
    document.cookie = `${name}=${value};${domain}path=/;`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      <div id="google_translate_element" style={{ display: 'none' }} />
      <Script
        id="google-translate-script"
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}