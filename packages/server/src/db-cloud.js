import { Redis } from '@upstash/redis';

// --- 🕵️‍♂️ START: Environment Variable Diagnostics 🕵️‍♂️ ---
// This is the most critical part for debugging the connection.
// It will print the values the server is ACTUALLY seeing.
console.log('--- [DB-CLOUD] INITIALIZING CONNECTION ---');
const kvUrl = process.env.KV_REST_API_URL || 'NOT_FOUND';
const kvToken = process.env.KV_REST_API_TOKEN || 'NOT_FOUND';

console.log(`[DB-CLOUD] Vercel KV_REST_API_URL found: ${kvUrl !== 'NOT_FOUND'}`);
console.log(`[DB-CLOUD] Vercel KV_REST_API_TOKEN found: ${kvToken !== 'NOT_FOUND'}`);
// For security, we only log the first few characters of the token.
if (kvToken !== 'NOT_FOUND') {
  console.log(`[DB-CLOUD] Token starts with: ${kvToken.substring(0, 8)}...`);
}
console.log('--- [DB-CLOUD] END DIAGNOSTICS ---');

// Normalize env for Upstash SDK using Vercel KV vars
if (process.env.KV_REST_API_URL && !process.env.UPSTASH_REDIS_REST_URL) {
  process.env.UPSTASH_REDIS_REST_URL = process.env.KV_REST_API_URL;
}
if (process.env.KV_REST_API_TOKEN && !process.env.UPSTASH_REDIS_REST_TOKEN) {
  process.env.UPSTASH_REDIS_REST_TOKEN = process.env.KV_REST_API_TOKEN;
}

const upstash = Redis.fromEnv();

// --- Low-Level KV Operations with Logging ---

async function kvGet(key) {
  console.log(`[DB] ➡️  GETTING key: "${key}"`);
  try {
    const result = await upstash.get(key);
    console.log(`[DB] ✅  GET SUCCESS for key: "${key}". Data exists: ${!!result}`);
    return result;
  } catch (error) {
    console.error(`[DB] ❌  GET FAILED for key: "${key}". Error:`, error.message);
    throw error; // Re-throw to be caught by the calling function
  }
}

async function kvSet(key, value) {
  const valueType = typeof value;
  console.log(`[DB] ➡️  SETTING key: "${key}" (type: ${valueType})`);
  try {
    const result = await upstash.set(key, value);
    console.log(`[DB] ✅  SET SUCCESS for key: "${key}"`);
    return result;
  } catch (error) {
    console.error(`[DB] ❌  SET FAILED for key: "${key}". Error:`, error.message);
    throw error;
  }
}

async function kvDel(key) {
  console.log(`[DB] ➡️  DELETING key: "${key}"`);
  try {
    const result = await upstash.del(key);
    console.log(`[DB] ✅  DELETE SUCCESS for key: "${key}"`);
    return result;
  } catch (error) {
    console.error(`[DB] ❌  DELETE FAILED for key: "${key}". Error:`, error.message);
    throw error;
  }
}

// --- High-Level Guide Logic ---

export function generateUniqueId() {
  const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
  console.log(`[UTIL] ✨ Generated new unique ID: ${id}`);
  return id;
}

export async function getAllGuides() {
  console.log('[API] 🚀 Fetching all guides index...');
  try {
    const guideIndex = await kvGet('guides_index');
    console.log('[API] ✅ Successfully fetched guides index.');
    return guideIndex || [];
  } catch (error) {
    console.error('[API] ❌ Error in getAllGuides:', error.message);
    return []; // Return empty array on failure to prevent crashes
  }
}

export async function getGuideById(id) {
  console.log(`[API] 🚀 Fetching guide with ID: ${id}`);
  try {
    const guide = await kvGet(`guide:${id}`);
    if (guide && !guide.homePage) {
      console.log(`[API] 🔧 Guide ${id} is missing a homepage. Adding default.`);
      guide.homePage = {
        title: 'ברוכים הבאים למדריך!',
        content: 'מדריך זה נועד לסייע לכם...',
      };
    }
    console.log(`[API] ✅ Successfully fetched guide ${id}.`);
    return guide;
  } catch (error) {
    console.error(`[API] ❌ Error in getGuideById for ID ${id}:`, error.message);
    return null;
  }
}

export async function createGuide(guide) {
  console.log('[API] 🚀 Starting "createGuide" process...');
  try {
    if (!guide.title || typeof guide.title !== 'string') {
      throw new Error('Guide title is required and must be a string');
    }
    if (!guide.chapters || !Array.isArray(guide.chapters)) {
      throw new Error('Guide chapters must be an array');
    }

    const newGuide = {
      _id: guide._id || generateUniqueId(),
      title: guide.title,
      homePage: guide.homePage || { title: 'ברוכים הבאים למדריך!', content: '...' },
      chapters: guide.chapters || [],
    };

    console.log(`[API] 🔎 Checking if guide ID "${newGuide._id}" already exists...`);
    const existingGuide = await kvGet(`guide:${newGuide._id}`);
    if (existingGuide) {
      console.warn(`[API] ⚠️ Attempted to create a guide with an existing ID: ${newGuide._id}`);
      throw new Error('Guide with this ID already exists');
    }
    console.log(`[API] 👍 Guide ID "${newGuide._id}" is available.`);

    console.log(`[API] 💾 Saving new guide: ${newGuide._id}`);
    await kvSet(`guide:${newGuide._id}`, newGuide);

    console.log('[API] 🔄 Updating guides index...');
    const guideIndex = await kvGet('guides_index') || [];
    guideIndex.push({ _id: newGuide._id, title: newGuide.title });
    await kvSet('guides_index', guideIndex);

    console.log(`[API] ✅ Successfully created guide ${newGuide._id}.`);
    return newGuide;
  } catch (error) {
    console.error('[API] ❌ Error in createGuide:', error.message);
    throw error; // Propagate the error to the controller
  }
}

export async function updateGuide(id, updatedGuide) {
    console.log(`[API] 🚀 Starting "updateGuide" process for ID: ${id}`);
  try {
    if (!updatedGuide.title || typeof updatedGuide.title !== 'string') {
      throw new Error('Guide title is required and must be a string');
    }
    if (!updatedGuide.chapters || !Array.isArray(updatedGuide.chapters)) {
      throw new Error('Guide chapters must be an array');
    }

    console.log(`[API] 🔎 Checking if guide to update exists: ${id}`);
    const existingGuide = await kvGet(`guide:${id}`);
    if (!existingGuide) {
      console.warn(`[API] ⚠️ Guide with ID ${id} not found for update.`);
      return null;
    }
    console.log(`[API] 👍 Found guide to update: ${id}`);
    
    const guide = {
      _id: id,
      title: updatedGuide.title,
      homePage: updatedGuide.homePage || existingGuide.homePage || { title: 'ברוכים הבאים למדריך!', content: '...' },
      chapters: updatedGuide.chapters,
    };
    
    console.log(`[API] 💾 Saving updated guide: ${id}`);
    await kvSet(`guide:${id}`, guide);

    if (existingGuide.title !== updatedGuide.title) {
      console.log(`[API] 🔄 Title changed. Updating guides index for ID: ${id}`);
      const guideIndex = await kvGet('guides_index') || [];
      const updatedIndex = guideIndex.map(item =>
        item._id === id ? { ...item, title: updatedGuide.title } : item
      );
      await kvSet('guides_index', updatedIndex);
    }
    
    console.log(`[API] ✅ Successfully updated guide ${id}.`);
    return guide;
  } catch (error) {
    console.error(`[API] ❌ Error in updateGuide for ID ${id}:`, error.message);
    throw error;
  }
}

export async function deleteGuide(id) {
  console.log(`[API] 🚀 Starting "deleteGuide" process for ID: ${id}`);
  try {
    console.log(`[API] 🔎 Checking if guide to delete exists: ${id}`);
    const existingGuide = await kvGet(`guide:${id}`);
    if (!existingGuide) {
      console.warn(`[API] ⚠️ Guide with ID ${id} not found for deletion.`);
      return false;
    }

    console.log(`[API] 🗑️ Deleting guide object: guide:${id}`);
    await kvDel(`guide:${id}`);

    console.log(`[API] 🔄 Updating guides index after deletion...`);
    const guideIndex = await kvGet('guides_index') || [];
    const updatedIndex = guideIndex.filter(item => item._id !== id);
    await kvSet('guides_index', updatedIndex);

    console.log(`[API] ✅ Successfully deleted guide ${id}.`);
    return true;
  } catch (error) {
    console.error(`[API] ❌ Error in deleteGuide for ID ${id}:`, error.message);
    throw error;
  }
}
