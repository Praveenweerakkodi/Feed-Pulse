/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enables standalone mode for Docker deployments
  // This bundles only the files needed for production avoiding the whole node_modules
  output: 'standalone',

  // Optionally suppress ESLint/TypeScript errors during build
  // if you want to ensure the Docker build never fails due to minor warnings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, 
  }
};

export default nextConfig;
