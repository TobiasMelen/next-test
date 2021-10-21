/**@type {import("next").NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    swcLoader: true,
  },
  typescript: {
    ignoreBuildErrors: true,  
  },
}
