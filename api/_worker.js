// Adaptateur serverless Node.js pour Vercel
// Importe le bundle SSR généré par `npm run build` dans `dist/server/`

let serverInstance = null;

async function getServer() {
  if (serverInstance) return serverInstance;
  
  try {
    // Charge le module ESM depuis dist/server/index.js
    const module = await import('../dist/server/index.js');
    serverInstance = module.default ?? module.workerEntry ?? module.w;
    
    if (!serverInstance || typeof serverInstance.fetch !== 'function') {
      throw new Error('Server handler not found or missing fetch method');
    }
    
    return serverInstance;
  } catch (error) {
    console.error('Failed to load server bundle:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  try {
    const server = await getServer();
    
    // Crée une requête Web API standard à partir de req Node.js
    const url = new URL(req.url, `http://${req.headers.host}`);
    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
    });
    
    // Appelle le handler SSR
    const response = await server.fetch(request, undefined, undefined);
    
    // Retransmet les headers et le statut
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    res.statusCode = response.status;
    res.end(await response.text());
  } catch (error) {
    console.error('Handler error:', error);
    res.statusCode = 500;
    res.setHeader('content-type', 'text/plain');
    res.end('Internal Server Error');
  }
}
