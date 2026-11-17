/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  // Pretty public URLs without bracketed folder names (safer for phone/zip uploads).
  async rewrites() {
    return [
      { source: "/invite/:id", destination: "/i?id=:id" },
      { source: "/manage/:id", destination: "/m?id=:id" },
    ];
  },
};
