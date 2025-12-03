/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para ignorar erros de certificado SSL durante o build
  // Isso é necessário quando há proxy corporativo com certificados auto-assinados
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
