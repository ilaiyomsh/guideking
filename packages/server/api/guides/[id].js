// Vercel API Route for specific guide operations
import cors from 'cors';
import { getGuideById, updateGuide, deleteGuide } from '../../src/controllers/guideController.js';

// CORS configuration
const corsOptions = {
  origin: [
    'https://guideking-client-admin.vercel.app',
    'https://guideking-client-viewer.vercel.app',
    'http://localhost:3000',
    'http://localhost:3002'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Helper function to handle CORS
function runCors(req, res) {
  return new Promise((resolve, reject) => {
    cors(corsOptions)(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  try {
    // Handle CORS
    await runCors(req, res);

    const { method, query: { id } } = req;

    // Ensure JSON body parsing for serverless
    if ((method === 'POST' || method === 'PUT') && typeof req.body === 'undefined') {
      const contentType = req.headers['content-type'] || '';
      if (contentType.includes('application/json')) {
        const raw = await new Promise((resolve, reject) => {
          let data = '';
          req.on('data', chunk => { data += chunk; });
          req.on('end', () => resolve(data));
          req.on('error', reject);
        });
        req.body = raw ? JSON.parse(raw) : {};
      }
    }

    console.log('API Request for ID:', { method, id, body: req.body });

    if (!id) {
      return res.status(400).json({ error: 'Guide ID is required' });
    }

    // Set params for controller functions
    req.params = { id };

    switch (method) {
      case 'OPTIONS':
        // Preflight request
        res.status(204).end();
        break;

      case 'GET':
        // Get specific guide
        await getGuideById(req, res);
        break;

      case 'PUT':
        // Update existing guide
        await updateGuide(req, res);
        break;

      case 'DELETE':
        // Delete guide
        await deleteGuide(req, res);
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE', 'OPTIONS']);
        res.status(405).json({ error: `Method ${method} not allowed` });
        break;
    }
  } catch (error) {
    console.error('API Error for ID:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}
