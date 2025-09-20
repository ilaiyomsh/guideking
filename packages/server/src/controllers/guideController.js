// Use cloud DB for production, local DB for development
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

// Dynamic import function
async function getDb() {
  if (isProduction) {
    return await import('../db-cloud.js');
  } else {
    return await import('../db.js');
  }
}

// GET /api/guides - Get all guides (only _id and title)
export const getAllGuides = async (req, res) => {
  try {
    const db = await getDb();
    const guides = await db.getAllGuides();
    res.status(200).json(guides);
  } catch (error) {
    console.error('Error fetching guides:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/guides/:id - Get guide by ID
export const getGuideById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const guide = await db.getGuideById(id);
    
    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }
    
    res.status(200).json(guide);
  } catch (error) {
    console.error('Error fetching guide:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/guides - Create new guide
export const createGuide = async (req, res) => {
  try {
    const db = await getDb();
    const guide = await db.createGuide(req.body);
    res.status(201).json(guide);
  } catch (error) {
    console.error('Error creating guide:', error);
    
    if (error.message.includes('required') || error.message.includes('must be')) {
      return res.status(400).json({ error: error.message });
    }
    
    if (error.message.includes('already exists')) {
      return res.status(409).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/guides/:id - Update existing guide
export const updateGuide = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const updatedGuide = await db.updateGuide(id, req.body);
    
    if (!updatedGuide) {
      return res.status(404).json({ error: 'Guide not found' });
    }
    
    res.status(200).json(updatedGuide);
  } catch (error) {
    console.error('Error updating guide:', error);
    
    if (error.message.includes('required') || error.message.includes('must be')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/guides/:id - Delete guide
export const deleteGuide = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const deleted = await db.deleteGuide(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Guide not found' });
    }
    
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting guide:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
