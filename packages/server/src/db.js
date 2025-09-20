import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const GUIDES_DIR = path.join(DATA_DIR, 'guides');
const INDEX_FILE = path.join(DATA_DIR, 'index.json');

// Initialize data structure if it doesn't exist
async function initializeDataStructure() {
  try {
    await fs.access(DATA_DIR);
  } catch (error) {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
  
  try {
    await fs.access(GUIDES_DIR);
  } catch (error) {
    await fs.mkdir(GUIDES_DIR, { recursive: true });
  }
  
  try {
    await fs.access(INDEX_FILE);
  } catch (error) {
    await fs.writeFile(INDEX_FILE, JSON.stringify([], null, 2));
  }
}

// Read index file (list of all guides with _id and title only)
async function readIndexFile() {
  await initializeDataStructure();
  const data = await fs.readFile(INDEX_FILE, 'utf-8');
  return JSON.parse(data);
}

// Write index file (atomic operation)
async function writeIndexFile(index) {
  const tempFile = INDEX_FILE + '.tmp';
  await fs.writeFile(tempFile, JSON.stringify(index, null, 2));
  await fs.rename(tempFile, INDEX_FILE);
}

// Read individual guide file
async function readGuideFile(id) {
  const guideFile = path.join(GUIDES_DIR, `${id}.json`);
  try {
    const data = await fs.readFile(guideFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return null; // Guide file doesn't exist
  }
}

// Write individual guide file (atomic operation)
async function writeGuideFile(guide) {
  const guideFile = path.join(GUIDES_DIR, `${guide._id}.json`);
  const tempFile = guideFile + '.tmp';
  await fs.writeFile(tempFile, JSON.stringify(guide, null, 2));
  await fs.rename(tempFile, guideFile);
}

// Delete individual guide file
async function deleteGuideFile(id) {
  const guideFile = path.join(GUIDES_DIR, `${id}.json`);
  try {
    await fs.unlink(guideFile);
    return true;
  } catch (error) {
    return false; // File didn't exist
  }
}

// Get all guides (only _id and title)
export async function getAllGuides() {
  return await readIndexFile();
}

// Get guide by ID
export async function getGuideById(id) {
  const guide = await readGuideFile(id);
  if (guide && !guide.homePage) {
    // Add default home page if missing
    guide.homePage = {
      title: 'ברוכים הבאים למדריך!',
      content: 'מדריך זה נועד לסייע לכם. הוא מחולק למספר פרקים, וכל אחד מהם מכסה נושא חשוב.\n\nכדי להתחיל, בחרו את הפרק הרצוי מסרגל הניווט.'
    };
  }
  return guide;
}

// Create new guide
export async function createGuide(guide) {
  // Validate required fields
  if (!guide.title || typeof guide.title !== 'string') {
    throw new Error('Guide title is required and must be a string');
  }
  
  if (!guide.chapters || !Array.isArray(guide.chapters)) {
    throw new Error('Guide chapters must be an array');
  }

  // Generate unique ID if not provided
  const newGuide = {
    _id: guide._id || generateUniqueId(),
    title: guide.title,
    homePage: guide.homePage || {
      title: 'ברוכים הבאים למדריך!',
      content: 'מדריך זה נועד לסייע לכם. הוא מחולק למספר פרקים, וכל אחד מהם מכסה נושא חשוב.\n\nכדי להתחיל, בחרו את הפרק הרצוי מסרגל הניווט.'
    },
    chapters: guide.chapters || []
  };

  // Check if ID already exists
  const existingGuide = await readGuideFile(newGuide._id);
  if (existingGuide) {
    throw new Error('Guide with this ID already exists');
  }

  // Write the guide file
  await writeGuideFile(newGuide);
  
  // Update index
  const index = await readIndexFile();
  index.push({
    _id: newGuide._id,
    title: newGuide.title
  });
  await writeIndexFile(index);
  
  return newGuide;
}

// Update existing guide
export async function updateGuide(id, updatedGuide) {
  // Validate required fields
  if (!updatedGuide.title || typeof updatedGuide.title !== 'string') {
    throw new Error('Guide title is required and must be a string');
  }
  
  if (!updatedGuide.chapters || !Array.isArray(updatedGuide.chapters)) {
    throw new Error('Guide chapters must be an array');
  }

  // Check if guide exists
  const existingGuide = await readGuideFile(id);
  if (!existingGuide) {
    return null; // Guide not found
  }

  // Preserve the original ID and merge with existing data
  const guide = {
    _id: id,
    title: updatedGuide.title,
    homePage: updatedGuide.homePage || existingGuide.homePage || {
      title: 'ברוכים הבאים למדריך!',
      content: 'מדריך זה נועד לסייע לכם. הוא מחולק למספר פרקים, וכל אחד מהם מכסה נושא חשוב.\n\nכדי להתחיל, בחרו את הפרק הרצוי מסרגל הניווט.'
    },
    chapters: updatedGuide.chapters
  };

  // Write updated guide file
  await writeGuideFile(guide);
  
  // Update index if title changed
  if (existingGuide.title !== updatedGuide.title) {
    const index = await readIndexFile();
    const indexEntry = index.find(item => item._id === id);
    if (indexEntry) {
      indexEntry.title = updatedGuide.title;
      await writeIndexFile(index);
    }
  }
  
  return guide;
}

// Delete guide
export async function deleteGuide(id) {
  // Check if guide exists and delete the file
  const deleted = await deleteGuideFile(id);
  if (!deleted) {
    return false; // Guide not found
  }

  // Remove from index
  const index = await readIndexFile();
  const indexPosition = index.findIndex(item => item._id === id);
  if (indexPosition !== -1) {
    index.splice(indexPosition, 1);
    await writeIndexFile(index);
  }
  
  return true;
}

// Generate unique ID (simple implementation for MVP)
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
