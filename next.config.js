/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly tell Turbopack the workspace root to avoid lockfile confusion
  // This points to the directory containing this next.config.js (the project root)
  turbopack: {
    root: __dirname,
  },
  // Optional: you can also disable Turbopack entirely on the free tier if builds keep hanging
  // Uncomment the line below to fall back to the classic webpack compiler
  // experimental: { turbopack: false },
};

module.exports = nextConfig;
