/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images:{
    domains:['raw.githubusercontent.com','static.wikia.nocookie.net']
  }
}

module.exports = nextConfig
