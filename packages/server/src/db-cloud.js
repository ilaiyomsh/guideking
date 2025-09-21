import { Redis } from '@upstash/redis';

// Normalize env for Upstash SDK using Vercel KV vars
if (process.env.KV_REST_API_URL && !process.env.UPSTASH_REDIS_REST_URL) {
  process.env.UPSTASH_REDIS_REST_URL = process.env.KV_REST_API_URL;
}
if (process.env.KV_REST_API_TOKEN && !process.env.UPSTASH_REDIS_REST_TOKEN) {
  process.env.UPSTASH_REDIS_REST_TOKEN = process.env.KV_REST_API_TOKEN;
}

const upstash = Redis.fromEnv();

async function kvGet(key) {
  console.log('🔴 KV GET:', key);
  try {
    const result = await upstash.get(key);
    console.log('🟢 KV GET SUCCESS:', key, result ? 'HAS_DATA' : 'NULL');
    return result;
  } catch (error) {
    console.error('🔴 KV GET ERROR:', key, error.message);
    throw error;
  }
}

async function kvSet(key, value) {
  console.log('🔴 KV SET:', key, typeof value);
  try {
    const result = await upstash.set(key, value);
    console.log('🟢 KV SET SUCCESS:', key);
    return result;
  } catch (error) {
    console.error('🔴 KV SET ERROR:', key, error.message);
    throw error;
  }
}

async function kvDel(key) {
  return await upstash.del(key);
}

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
    console.log('🔵 Creating guide with data:', JSON.stringify(guide));
    
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

    console.log('🔵 Generated guide ID:', newGuide._id);
    console.log('🔵 Checking if guide exists...');
    
    // Check if ID already exists
    const existingGuide = await kvGet(`guide:${newGuide._id}`);
    console.log('🔵 Existing guide check result:', existingGuide ? 'EXISTS' : 'NOT_EXISTS');
    
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
