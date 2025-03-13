import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["i.pravatar.cc", "source.unsplash.com", "hemnffexpmrczjjusnnj.supabase.co"], // Autoriser les domaines d'images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rgnnrsrdrrfzvjtfevim.supabase.co', // Domaine de Supabase
        port: '',
        pathname: '/storage/v1/object/public/**', // Autoriser les chemins publics
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

module.exports = nextConfig;


export default nextConfig;
