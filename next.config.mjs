/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow unoptimized images globally (Cloudinary already optimises them)
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },

  // Tell Next.js to bundle nodemailer server-side (not split into edge chunks)
  experimental: {
    serverComponentsExternalPackages: ['nodemailer'],
  },

  // Silence the "Critical dependency" warning from nodemailer
  webpack: (config) => {
    config.externals = config.externals || [];
    return config;
  },
};

export default nextConfig;
