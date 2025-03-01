import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rgnnrsrdrrfzvjtfevim.supabase.co', // Domaine de Supabase
        port: '',
        pathname: '/storage/v1/object/public/**', // Autoriser les chemins publics
      },
    ],
  },
};

module.exports = nextConfig;


export default nextConfig;
