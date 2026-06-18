import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
 images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', // Укажите порт, на котором работает ваше приложение
        pathname: '/api/media/**', // Разрешаем все пути внутри /api/media/
      },
    ],
  },

}

export default withPayload(nextConfig)