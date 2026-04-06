'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';

interface SafeImageProps extends Omit<ImageProps, 'placeholder' | 'blurDataURL'> {}

export default function SafeImage({ src, alt, className, ...props }: SafeImageProps) {
  const [error, setError]     = useState(false);
  const [loaded, setLoaded]   = useState(false);

  // Reset state when src changes
  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  if (error) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center bg-[var(--surface-2)] text-[var(--text-muted)] gap-2 border border-[var(--border)]',
          className,
        )}
      >
        <ImageOff size={20} className="opacity-20" />
        <span className="text-[10px] uppercase tracking-widest opacity-40">View Unavailable</span>
      </div>
    );
  }

  return (
    <Image
      {...props}
      unoptimized
      src={src}
      alt={alt}
      className={cn(
        'transition-all duration-700 ease-out',
        loaded ? 'opacity-100' : 'opacity-0',
        className,
      )}
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
    />
  );
}
