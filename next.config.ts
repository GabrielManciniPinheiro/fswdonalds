import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* --- 1. Configuração de Imagens --- */
  images: {
    remotePatterns: [
      { hostname: "u9a6wmr3as.ufs.sh" }, // Sua URL atual
      { hostname: "xilp8h6cg4.ufs.sh" }, // <--- Adicione a nova URL aqui (apenas o domínio)
      // { hostname: "images.unsplash.com" }, // Outro exemplo, se precisar
    ],
  },

  /* --- 2. Configuração de Redirecionamento --- */
  async redirects() {
    return [
      {
        source: "/", // Quando acessar a raiz
        destination: "/gmp-fastfoods", // Vai para a rota do seu projeto
        permanent: true, // Cacheia o redirecionamento
      },
    ];
  },
};

export default nextConfig;
