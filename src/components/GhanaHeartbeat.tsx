'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

export default function GhanaHeartbeat() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative flex items-center justify-center w-32 h-32 lg:w-48 lg:h-48">
      {/* The "Ping" Echo Effect */}
      <motion.div
        className="absolute inset-0 opacity-50"
        animate={isLoaded ? {
          scale: [1, 1.6],
          opacity: [0.5, 0],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
          times: [0, 1]
        }}
      >
        <Image
          src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775411642/download_pixian_ai_gz0czv.png"
          alt=""
          fill
          unoptimized
          className="object-contain brightness-0 invert opacity-20"
        />
      </motion.div>

      {/* The Main Heartbeat Map */}
      <motion.div
        className="relative w-full h-full"
        animate={isLoaded ? {
          scale: [1, 1.03, 1, 1.08, 1],
          filter: [
            'drop-shadow(0 0 0px rgba(201,150,58,0))',
            'drop-shadow(0 0 12px rgba(201,150,58,0.4))',
            'drop-shadow(0 0 0px rgba(201,150,58,0))',
          ]
        } : {}}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.1, 0.2, 0.4, 1]
        }}
      >
        <Image
          src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775411642/download_pixian_ai_gz0czv.png"
          alt="Ghana Map Flag"
          fill
          unoptimized
          className="object-contain"
          priority
          onLoad={() => setIsLoaded(true)}
        />
      </motion.div>
    </div>
  );
}