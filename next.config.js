/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["<random_string>.supabase.in", "lh3.googleusercontent.com"],
  },
};

module.exports = nextConfig;
