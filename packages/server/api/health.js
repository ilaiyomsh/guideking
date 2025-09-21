// Health check endpoint for Vercel
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      redis: {
        KV_URL: process.env.KV_URL ? 'SET' : 'NOT SET',
        KV_REST_API_URL: process.env.KV_REST_API_URL ? 'SET' : 'NOT SET',
        KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? 'SET' : 'NOT SET'
      }
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
