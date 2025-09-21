// Test Redis connection endpoint
import { Redis } from '@upstash/redis';

// Normalize env for Upstash SDK using Vercel KV vars
if (process.env.KV_REST_API_URL && !process.env.UPSTASH_REDIS_REST_URL) {
  process.env.UPSTASH_REDIS_REST_URL = process.env.KV_REST_API_URL;
}
if (process.env.KV_REST_API_TOKEN && !process.env.UPSTASH_REDIS_REST_TOKEN) {
  process.env.UPSTASH_REDIS_REST_TOKEN = process.env.KV_REST_API_TOKEN;
}

const upstash = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔵 Testing Redis connection...');
    console.log('🔵 ENV vars:', {
      KV_REST_API_URL: process.env.KV_REST_API_URL ? 'SET' : 'NOT_SET',
      KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? 'SET' : 'NOT_SET',
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ? 'SET' : 'NOT_SET',
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ? 'SET' : 'NOT_SET'
    });

    // Test simple SET operation
    console.log('🔵 Testing SET operation...');
    await upstash.set('test_key', 'test_value');
    console.log('🟢 SET successful');

    // Test simple GET operation
    console.log('🔵 Testing GET operation...');
    const value = await upstash.get('test_key');
    console.log('🟢 GET successful, value:', value);

    // Test DELETE operation
    console.log('🔵 Testing DELETE operation...');
    await upstash.del('test_key');
    console.log('🟢 DELETE successful');

    res.json({
      status: 'SUCCESS',
      message: 'Redis connection test passed',
      test_value: value
    });

  } catch (error) {
    console.error('🔴 Redis test failed:', error);
    res.status(500).json({
      status: 'FAILED',
      error: error.message,
      type: error.constructor.name
    });
  }
}
