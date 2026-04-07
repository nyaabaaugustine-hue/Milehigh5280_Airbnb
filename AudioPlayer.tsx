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
  const [isMounted, setIsMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Trigger entry animation
    setIsMounted(true);
  }, []);

  const currentTrack = playlist[currentIndex];

  // Handle track transition and initial load
  useEffect(() => {
    if (!isVisible) return;

    if (audioRef.current) {
      setIsLoading(true);
      audioRef.current.load();
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.log("Autoplay prevented or interrupted. Awaiting interaction.", error);
            setIsPlaying(false);
            setIsLoading(false);
          });
      }
    }
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
    <div 
      className={`fixed bottom-6 right-6 z-[9999] transition-all duration-1000 ease-out transform ${
        isMounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
    >
      <div className="bg-[#0a0a0a] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl p-4 w-72 flex items-center space-x-4 relative">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute -top-2 -right-2 bg-stone-200 text-black rounded-full p-1 shadow-lg hover:bg-white transition-colors"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        {/* Animation Icon */}
        <div className="relative flex-shrink-0">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 cursor-pointer"
            style={{ 
              animation: isPlaying && !isLoading ? 'spin 10s linear infinite' : 'none' 
            }}
            onClick={() => {
              if (isPlaying) audioRef.current?.pause();
              else audioRef.current?.play().catch(console.error);
            }}
          >
            {isLoading ? (
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce"></div>
              </div>
            ) : isPlaying ? (
              <svg className="w-6 h-6 text-stone-200" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-6 h-6 text-stone-200 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </div>
          {!isLoading && isPlaying && (
            <span className="absolute inset-0 rounded-full bg-stone-400 animate-ping opacity-10"></span>
          )}
        </div>

        {/* Text Details */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <p className="text-xs font-bold text-stone-500 animate-pulse uppercase tracking-wider">
              Loading audio...
            </p>
          ) : (
            <>
              <p className="text-[10px] text-stone-500 uppercase font-bold tracking-widest mb-0.5">Now Playing</p>
              <p className="text-sm font-bold text-stone-200 truncate">
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
              className="p-1.5 text-stone-400 hover:text-stone-200 hover:scale-110 transition-all"
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
          </div>
        )}

        <audio
          ref={audioRef}
          src={currentTrack.url}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleEnded}
          onCanPlay={() => setIsLoading(false)}
          onCanPlayThrough={() => setIsLoading(false)}
          onLoadedMetadata={() => setIsLoading(false)}
          onWaiting={() => setIsLoading(true)}
          muted={isMuted}
          hidden
        />
      </div>
    </div>
  );
}