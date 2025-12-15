import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { createClient, type RedisClientType } from 'redis';

interface SearchResult {
  id: string;
  name: string;
  summary: string;
  distance: number;
  similarity: number;
}

interface AISearchRequest {
  query: string;
  limit?: number;
  useCache?: boolean;
}

const prisma = new PrismaClient();

let redisClient: RedisClientType | null = null;

function getRedisClient(): RedisClientType | null {
  const redisHost = process.env.REDIS_HOST;
  const redisPort = process.env.REDIS_PORT;
  const redisPassword = process.env.REDIS_PASSWORD;

  // If Redis isn't configured, run without caching.
  if (!redisHost) return null;

  if (!redisClient) {
    redisClient = createClient({
      socket: {
        host: redisHost,
        port: parseInt(redisPort || '6379'),
      },
      password: redisPassword,
    });

    redisClient.on('error', (err: Error) => console.error('Redis error:', err));
  }

  return redisClient;
}

async function ensureRedisConnected(client: RedisClientType): Promise<boolean> {
  if (client.isOpen) return true;
  try {
    await client.connect();
    return true;
  } catch (error) {
    console.error('Redis connect error:', error);
    return false;
  }
}

const GEMINI_API_KEY = process.env.OPENAI_API_KEY; // Using same env var
const EMBEDDING_MODEL = 'text-embedding-004';
const CACHE_TTL = 3600; // 1 hour

async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${GEMINI_API_KEY}`,
      {
        model: `models/${EMBEDDING_MODEL}`,
        content: {
          parts: [{ text }]
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.embedding.values;
  } catch (error) {
    console.error('Embedding error:', error);
    throw error;
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

async function searchYellowBooks(req: AISearchRequest): Promise<SearchResult[]> {
  const { query, limit = 5, useCache = true } = req;

  // Validate query
  if (!query || query.trim().length === 0) {
    throw new Error('Query is required');
  }

  if (query.length > 500) {
    throw new Error('Query too long (max 500 characters)');
  }

  // Check cache
  if (useCache) {
    try {
      const client = getRedisClient();
      if (client && (await ensureRedisConnected(client))) {
        const cached = await client.get(`ai-search:${query}`);
        if (cached) {
          console.log(`📦 Cache hit: ${query}`);
          return JSON.parse(cached);
        }
      }
    } catch (error) {
      console.error('Cache lookup error:', error);
    }
  }

  // Get query embedding
  const queryEmbedding = await getEmbedding(query.trim());

  // Find similar businesses
  const businesses = (await prisma.$queryRaw`
    SELECT id, name, summary, embedding 
    FROM "YellowBookEntry" 
    WHERE embedding IS NOT NULL 
      AND array_length(embedding, 1) > 0
    LIMIT 1000
  `) as Array<{
    id: string;
    name: string;
    summary: string;
    embedding: number[];
  }>;

  // Calculate similarity and sort
  const results = businesses
    .map((business) => ({
      id: business.id,
      name: business.name,
      summary: business.summary,
      similarity: cosineSimilarity(queryEmbedding, business.embedding),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map((item, index) => ({
      id: item.id,
      name: item.name,
      summary: item.summary,
      similarity: item.similarity,
      distance: index,
    }));

  // Cache results
  if (useCache) {
    try {
      const client = getRedisClient();
      if (client && (await ensureRedisConnected(client))) {
        await client.setEx(`ai-search:${query}`, CACHE_TTL, JSON.stringify(results));
        console.log(`💾 Cached: ${query}`);
      }
    } catch (error) {
      console.error('Cache save error:', error);
    }
  }

  return results;
}

const aiSearchRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /api/ai/yellow-books/search
  fastify.post(
    '/api/ai/yellow-books/search',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const body = request.body as AISearchRequest;
        const results = await searchYellowBooks(body);
        reply.send(results);
      } catch (error) {
        console.error('Search error:', error);
        const err = error as Error;
        reply.status(400).send({
          error: err.message || 'Search failed',
        });
      }
    }
  );

  // DELETE /api/ai/yellow-books/cache
  fastify.delete(
    '/api/ai/yellow-books/cache',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const queryParams = request.query as { query?: string };
        const { query } = queryParams;

        const client = getRedisClient();
        if (!client || !(await ensureRedisConnected(client))) {
          return reply.send({ message: 'Redis is not configured; cache is disabled.' });
        }

        if (query) {
          await client.del(`ai-search:${query}`);
          reply.send({ message: `Cache cleared for query: ${query}` });
        } else {
          const keys = await client.keys('ai-search:*');
          if (keys.length > 0) {
            await client.del(keys);
          }
          reply.send({ message: 'All cache cleared' });
        }
      } catch (error) {
        console.error('Cache clear error:', error);
        const err = error as Error;
        reply.status(400).send({
          error: err.message || 'Cache clear failed',
        });
      }
    }
  );
};

export default aiSearchRoutes;
