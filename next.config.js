/** @type {import("next").NextConfig} */
module.exports = {
  swcMinify: true,
  images: {
    domains: ["images.ctfassets.net"],
    formats: ["image/webp", "image/avif"]
  },
};
