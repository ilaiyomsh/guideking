// Vercel serverless function entry point
import express from 'express';
import cors from 'cors';
import guideRoutes from '../src/api/guideRoutes.js';

const app = express();

// CORS configuration for production
app.use(cors({
  origin: [
    'https://guideking-client-admin.vercel.app',
    'https://guideking-client-viewer.vercel.app',
    'http://localhost:3000',
    'http://localhost:3002'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API routes
app.use('/api', guideRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Interactive Guides API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      guides: '/api/guides'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    path: req.path,
    method: req.method
  });
});

export default app;
