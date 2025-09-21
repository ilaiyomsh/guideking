// Vercel API Route for guides
import cors from 'cors';
import { getAllGuides, getGuideById, createGuide, updateGuide, deleteGuide } from '../../src/controllers/guideController.js';

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

    const { method } = req;
    const { id } = req.query;

    console.log('API Request:', { method, id, body: req.body });

    switch (method) {
      case 'OPTIONS':
        // Preflight request
        res.status(204).end();
        break;

      case 'GET':
        if (id) {
          // Get specific guide
          await getGuideById(req, res);
        } else {
          // Get all guides
          await getAllGuides(req, res);
        }
        break;

      case 'POST':
        // Create new guide
        await createGuide(req, res);
        break;

      case 'PUT':
        if (id) {
          // Update existing guide
          req.params = { id };
          await updateGuide(req, res);
        } else {
          res.status(400).json({ error: 'Guide ID is required for updates' });
        }
        break;

      case 'DELETE':
        if (id) {
          // Delete guide
          req.params = { id };
          await deleteGuide(req, res);
        } else {
          res.status(400).json({ error: 'Guide ID is required for deletion' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
        res.status(405).json({ error: `Method ${method} not allowed` });
        break;
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}
