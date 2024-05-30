module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/courses',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'metnorium-files-bucket.s3.eu-north-1.amazonaws.com',
      },
    ],
  },
}
