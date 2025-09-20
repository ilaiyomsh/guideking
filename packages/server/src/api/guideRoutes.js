import express from 'express';
import * as guideController from '../controllers/guideController.js';

const router = express.Router();

// GET /api/guides - Get all guides (only _id and title)
router.get('/', guideController.getAllGuides);

// GET /api/guides/:id - Get guide by ID
router.get('/:id', guideController.getGuideById);

// POST /api/guides - Create new guide
router.post('/', guideController.createGuide);

// PUT /api/guides/:id - Update existing guide
router.put('/:id', guideController.updateGuide);

// DELETE /api/guides/:id - Delete guide
router.delete('/:id', guideController.deleteGuide);

export default router;
