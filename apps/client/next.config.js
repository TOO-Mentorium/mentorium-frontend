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
  env: {
    apiUrl: 'https://mentorium.su/api/api_v1',
    bffUrl: 'https://app-mentorium.netlify.app/api',
    // apiUrl: 'https://mentorium.su/api/api_v1',
    // bffUrl: 'https://localhost:3000/api',
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
