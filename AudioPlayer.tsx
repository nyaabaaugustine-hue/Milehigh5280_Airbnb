'use client';

import { useState, useEffect, useRef } from 'react';

const playlist = [
  {
    id: 'maya',
    title: 'Maya Angelou',
    url: 'https://res.cloudinary.com/dwsl2ktt2/video/upload/v1775551765/maya_fqoizt.mp3',
  },
  {
    id: 'dubois',
    title: 'W. E. B. Du Bois',
    url: 'https://res.cloudinary.com/dwsl2ktt2/video/upload/v1775552278/w.e.du_bios_lyg2l6.mp3',
  }
];

export default function AudioPlayer() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = playlist[currentIndex];

  // Handle track transition and initial load
  useEffect(() => {
    if (!isVisible) return;

    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          console.log("Autoplay blocked by browser. Awaiting user interaction.");
        });
      }
    }, 1200); // Reduced loading time for faster feedback

    return () => clearTimeout(timer);
  }, [currentIndex, isVisible]);

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsVisible(false);
  };

  const handleEnded = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] opacity-100">
      <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 w-72 flex items-center space-x-4 relative">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute -top-2 -right-2 bg-slate-900 text-white rounded-full p-1 shadow-lg hover:bg-slate-700 transition-colors"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        {/* Animation Icon */}
        <div className="relative flex-shrink-0">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 ${isPlaying ? 'animate-spin-slow' : ''}`}>
            {isLoading ? (
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              </div>
            ) : (
              <svg className="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            )}
          </div>
          {!isLoading && isPlaying && (
            <span className="absolute inset-0 rounded-full bg-slate-400 animate-ping opacity-20"></span>
          )}
        </div>

        {/* Text Details */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <p className="text-sm font-medium text-slate-500 animate-pulse uppercase tracking-wider">
              Loading audio...
            </p>
          ) : (
            <>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-0.5">Now Playing</p>
              <p className="text-sm font-semibold text-slate-900 truncate">
                {currentTrack.title}
              </p>
            </>
          )}
        </div>

        {/* Controls */}
        {!isLoading && (
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 text-slate-900 hover:scale-110 transition-transform"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M11 5L6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6"/>
                </svg>
              ) : (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"/>
                </svg>
              )}
            </button>

            {/* Custom Play trigger if blocked by browser autoplay policy */}
            {!isPlaying && (
              <button 
                onClick={() => audioRef.current?.play()}
                className="p-1.5 text-slate-900 hover:scale-110 transition-transform"
              >
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </button>
            )}
          </div>
        )}

        <audio
          ref={audioRef}
          src={currentTrack.url}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleEnded}
          muted={isMuted}
          hidden
        />
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}