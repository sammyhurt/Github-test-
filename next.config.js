/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Tell webpack to treat better-sqlite3 as external (use native binary)
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        { 'better-sqlite3': 'commonjs better-sqlite3' },
      ];
    }
    return config;
  },
};

module.exports = nextConfig;
