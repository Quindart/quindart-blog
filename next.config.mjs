/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  serverComponentsExternalPackages: ['sanitize-html', 'htmlparser2', 'chrome-launcher', 'lighthouse'],
};

export default nextConfig;