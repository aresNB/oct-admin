export const config = { runtime: 'edge' } as const;

// Adaptateur minimal pour exécuter le bundle SSR produit par `npm run build`.
// Il importe le handler généré dans `dist/server/index.js` et lui passe la Request.
// Vercel exécutera `npm run build` (voir `vercel.json`) pour générer `dist/` avant le déploiement.

async function getServer() {
  // import dynamique pour réduire le risque de résolution statique prématurée
  return await import('../dist/server/index.js');
}

export default async function handler(request: Request) {
  const serverModule = await getServer();
  const server = (serverModule && serverModule.default) ?? serverModule.workerEntry ?? serverModule.w;
  if (!server || typeof server.fetch !== 'function') {
    return new Response('Server bundle not available', { status: 500 });
  }
  // Appelle directement la méthode fetch du worker bundle
  return await server.fetch(request, undefined, undefined);
}
