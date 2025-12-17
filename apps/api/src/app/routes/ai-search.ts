import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import axios, { type AxiosError } from 'axios';
import { PrismaClient } from '@prisma/client';
import { createClient, type RedisClientType } from 'redis';
import { createHash } from 'crypto';

interface SearchResult {
  id: string;
  name: string;
  summary: string;
  distance: number;
  similarity: number;
  category?: string;
  district?: string;
  phone?: string;
  matchReason?: string;
}

interface AISearchRequest {
  query: string;
  limit?: number;
  useCache?: boolean;
  minSimilarity?: number;
  categorySlug?: string;
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

const EMBEDDING_MODEL = 'text-embedding-004';
const CACHE_TTL = 3600; // 1 hour
const DEFAULT_MIN_SIMILARITY = 0.3; // Minimum similarity threshold

let didLogKeyFingerprint = false;

function getGeminiApiKey(): string {
  const key =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_AI_API_KEY ||
    process.env.OPENAI_API_KEY;

  if (!key || key.trim().length === 0) {
    throw new Error(
      'Gemini API key is not configured. Set GEMINI_API_KEY (or OPENAI_API_KEY for legacy) in the API environment.',
    );
  }

  if (process.env.AI_DEBUG === 'true' && !didLogKeyFingerprint) {
    didLogKeyFingerprint = true;
    const fingerprint = createHash('sha256').update(key).digest('hex').slice(0, 12);
    console.log('Gemini key fingerprint (sha256/12):', fingerprint);
  }

  return key;
}

// Normalize and clean query text
function normalizeQuery(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ''); // Keep only letters, numbers, spaces
}

// Generate cache key from query parameters
function getCacheKey(query: string, categorySlug?: string): string {
  const normalized = normalizeQuery(query);
  const key = categorySlug ? `${normalized}:${categorySlug}` : normalized;
  return `ai-search:${createHash('md5').update(key).digest('hex')}`;
}

async function getEmbedding(text: string): Promise<number[]> {
  try {
    const apiKey = getGeminiApiKey();
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`,
      {
        model: `models/${EMBEDDING_MODEL}`,
        content: {
          parts: [{ text: normalizeQuery(text) }]
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 20_000,
      }
    );

    return response.data.embedding.values;
  } catch (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const message =
      (axiosError.response?.data as any)?.error?.message || axiosError.message;

    console.error('Embedding error:', {
      status,
      message,
    });

    throw new Error(
      `Embedding request failed${status ? ` (${status})` : ''}: ${message}`,
    );
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length || a.length === 0) return 0;
  
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

// Determine match reason based on similarity score
function getMatchReason(similarity: number): string {
  if (similarity >= 0.8) return "Маш өндөр таарц";
  if (similarity >= 0.6) return "Сайн таарц";
  if (similarity >= 0.4) return "Дунд таарц";
  return "Бага таарц";
}

// Fallback text search when no embeddings available
async function textSearch(query: string, limit: number): Promise<SearchResult[]> {
  const searchTerms = query.toLowerCase().split(' ').filter(t => t.length > 1);
  
  const businesses = await prisma.yellowBookEntry.findMany({
    where: {
      OR: searchTerms.flatMap(term => [
        { name: { contains: term, mode: 'insensitive' as const } },
        { summary: { contains: term, mode: 'insensitive' as const } },
        { description: { contains: term, mode: 'insensitive' as const } },
      ]),
    },
    select: {
      id: true,
      name: true,
      summary: true,
      district: true,
      phone: true,
      category: { select: { name: true, slug: true } },
    },
    take: limit,
  });

  return businesses.map((b, index) => ({
    id: b.id,
    name: b.name,
    summary: b.summary,
    similarity: 0.5, // Default similarity for text search
    distance: index,
    category: b.category?.name,
    district: b.district || undefined,
    phone: b.phone || undefined,
    matchReason: "Текст хайлт",
  }));
}

async function searchYellowBooks(req: AISearchRequest): Promise<SearchResult[]> {
  const { 
    query, 
    limit = 5, 
    useCache = true, 
    minSimilarity = DEFAULT_MIN_SIMILARITY,
    categorySlug 
  } = req;

  // Validate query
  if (!query || query.trim().length === 0) {
    throw new Error('Query is required');
  }

  if (query.length > 500) {
    throw new Error('Query too long (max 500 characters)');
  }

  const cacheKey = getCacheKey(query, categorySlug);

  // Check cache
  if (useCache) {
    try {
      const client = getRedisClient();
      if (client && (await ensureRedisConnected(client))) {
        const cached = await client.get(cacheKey);
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
  let queryEmbedding: number[];
  try {
    queryEmbedding = await getEmbedding(query.trim());
  } catch (error) {
    console.error('Embedding failed, falling back to text search:', error);
    return textSearch(query, limit);
  }

  // Build category filter
  const categoryFilter = categorySlug 
    ? `AND c.slug = '${categorySlug}'` 
    : '';

  // Find similar businesses with category info
  const businesses = (await prisma.$queryRawUnsafe(`
    SELECT 
      e.id, 
      e.name, 
      e.summary, 
      e.embedding,
      e.district,
      e.phone,
      c.name as category_name,
      c.slug as category_slug
    FROM "YellowBookEntry" e
    LEFT JOIN "YellowBookCategory" c ON e."categoryId" = c.id
    WHERE e.embedding IS NOT NULL 
      AND array_length(e.embedding, 1) > 0
      ${categoryFilter}
    LIMIT 1000
  `)) as Array<{
    id: string;
    name: string;
    summary: string;
    embedding: number[];
    district: string | null;
    phone: string | null;
    category_name: string | null;
    category_slug: string | null;
  }>;

  if (businesses.length === 0) {
    console.log('No embeddings found, falling back to text search');
    return textSearch(query, limit);
  }

  // Calculate similarity and sort
  const results = businesses
    .map((business) => {
      const similarity = cosineSimilarity(queryEmbedding, business.embedding);
      return {
        id: business.id,
        name: business.name,
        summary: business.summary,
        similarity,
        category: business.category_name || undefined,
        district: business.district || undefined,
        phone: business.phone || undefined,
      };
    })
    .filter(item => item.similarity >= minSimilarity) // Filter by minimum similarity
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map((item, index) => ({
      ...item,
      distance: index,
      matchReason: getMatchReason(item.similarity),
    }));

  // Cache results
  if (useCache && results.length > 0) {
    try {
      const client = getRedisClient();
      if (client && (await ensureRedisConnected(client))) {
        await client.setEx(cacheKey, CACHE_TTL, JSON.stringify(results));
        console.log(`💾 Cached: ${query} (${results.length} results)`);
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
          const err = error as Error;
          console.error('Search error:', { message: err.message });
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
