import { kv as vercelKv } from '@vercel/kv';
import { createClient as createRedisClient } from 'redis';

// Decide storage driver at runtime: prefer Vercel KV REST; fallback to Redis URL
const hasVercelKvRest = !!process.env.KV_REST_API_URL && /upstash|vercel/i.test(process.env.KV_REST_API_URL);
const hasRedisUrl = !!process.env.KV_URL;

let redisClient = null;
async function getRedis() {
  if (!redisClient) {
    if (!hasRedisUrl) throw new Error('KV_URL is not set');
    redisClient = createRedisClient({ url: process.env.KV_URL });
    redisClient.on('error', (err) => console.error('Redis error:', err?.message || err));
    await redisClient.connect();
  }
  return redisClient;
}

// Simple key helpers abstracting KV/Redis
async function kvGet(key) {
  if (hasVercelKvRest) return await vercelKv.get(key);
  const client = await getRedis();
  const val = await client.get(key);
  return val ? JSON.parse(val) : null;
}

async function kvSet(key, value) {
  if (hasVercelKvRest) return await vercelKv.set(key, value);
  const client = await getRedis();
  return await client.set(key, JSON.stringify(value));
}

async function kvDel(key) {
  if (hasVercelKvRest) return await vercelKv.del(key);
  const client = await getRedis();
  return await client.del(key);
}

// Debug: Log environment selection (no secrets)
console.log('Cloud DB driver:', hasVercelKvRest ? 'Vercel KV REST' : hasRedisUrl ? 'Redis URL' : 'NONE');

// Generate unique ID for new guides
export function generateUniqueId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).substr(2)
  );
}

// Get all guides (only _id and title for performance)
export async function getAllGuides() {
  try {
    const guideIndex = await kvGet('guides_index');
    return guideIndex || [];
  } catch (error) {
    console.error('Error fetching guides index:', error);
    return [];
  }
}

// Get guide by ID
export async function getGuideById(id) {
  try {
    const guide = await kvGet(`guide:${id}`);
    if (guide && !guide.homePage) {
      // Add default home page if missing
      guide.homePage = {
        title: 'ברוכים הבאים למדריך!',
        content: 'מדריך זה נועד לסייע לכם. הוא מחולק למספר פרקים, וכל אחד מהם מכסה נושא חשוב.\n\nכדי להתחיל, בחרו את הפרק הרצוי מסרגל הניווט.'
      };
    }
    return guide;
  } catch (error) {
    console.error('Error fetching guide:', error);
    return null;
  }
}

// Create new guide
export async function createGuide(guide) {
  try {
    // Validate required fields
    if (!guide.title || typeof guide.title !== 'string') {
      throw new Error('Guide title is required and must be a string');
    }
    
    if (!guide.chapters || !Array.isArray(guide.chapters)) {
      throw new Error('Guide chapters must be an array');
    }

    // Generate unique ID and prepare guide
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
    const existingGuide = await kvGet(`guide:${newGuide._id}`);
    if (existingGuide) {
      throw new Error('Guide with this ID already exists');
    }

    // Save the guide
    await kvSet(`guide:${newGuide._id}`, newGuide);

    // Update the index
    const guideIndex = await kvGet('guides_index') || [];
    guideIndex.push({
      _id: newGuide._id,
      title: newGuide.title
    });
    await kvSet('guides_index', guideIndex);

    return newGuide;
  } catch (error) {
    console.error('Error creating guide:', error);
    throw error;
  }
}

// Update existing guide
export async function updateGuide(id, updatedGuide) {
  try {
    // Validate required fields
    if (!updatedGuide.title || typeof updatedGuide.title !== 'string') {
      throw new Error('Guide title is required and must be a string');
    }
    
    if (!updatedGuide.chapters || !Array.isArray(updatedGuide.chapters)) {
      throw new Error('Guide chapters must be an array');
    }

    // Check if guide exists
    const existingGuide = await kvGet(`guide:${id}`);
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

    // Save updated guide
    await kvSet(`guide:${id}`, guide);
    
    // Update index if title changed
    if (existingGuide.title !== updatedGuide.title) {
      const guideIndex = await kvGet('guides_index') || [];
      const updatedIndex = guideIndex.map(item => 
        item._id === id ? { ...item, title: updatedGuide.title } : item
      );
      await kvSet('guides_index', updatedIndex);
    }
    
    return guide;
  } catch (error) {
    console.error('Error updating guide:', error);
    throw error;
  }
}

// Delete guide
export async function deleteGuide(id) {
  try {
    // Check if guide exists
    const existingGuide = await kvGet(`guide:${id}`);
    if (!existingGuide) {
      return false; // Guide not found
    }

    // Delete the guide
    await kvDel(`guide:${id}`);
    
    // Update index
    const guideIndex = await kvGet('guides_index') || [];
    const updatedIndex = guideIndex.filter(item => item._id !== id);
    await kvSet('guides_index', updatedIndex);
    
    return true;
  } catch (error) {
    console.error('Error deleting guide:', error);
    throw error;
  }
}
