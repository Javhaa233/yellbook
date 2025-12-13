import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

// Google Gemini API ашиглана - embedding хэрэгтэй
const GEMINI_API_KEY = process.env.OPENAI_API_KEY; // Using same env var
const EMBEDDING_MODEL = 'text-embedding-004';

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

async function embedAllBusinesses() {
  console.log('🚀 Businesses embedding эхлүүлээ...\n');

  // Get all businesses without embedding using raw query
  const businesses = (await prisma.$queryRaw`
    SELECT id, name, "shortName", summary, description, "categoryId", district, province
    FROM "YellowBookEntry"
    WHERE embedding IS NULL OR array_length(embedding, 1) IS NULL OR array_length(embedding, 1) = 0
    LIMIT 1000
  `) as Array<{
    id: string;
    name: string;
    shortName?: string | null;
    summary: string;
    description?: string | null;
    categoryId: string;
    district: string;
    province: string;
  }>;

  console.log(`📊 Embedding хэрэгтэй: ${businesses.length} businesses\n`);

  let completed = 0;
  let failed = 0;

  for (const business of businesses) {
    try {
      // Embedding текст үүсгэнэ
      const text = [
        business.name,
        business.shortName,
        business.summary,
        business.description,
        business.district,
        business.province,
      ]
        .filter(Boolean)
        .join(' ');

      console.log(`⏳ Processing: ${business.name}...`);

      const embedding = await getEmbedding(text);

      // Database-д хадгалнa - raw SQL ашиглана
      await prisma.$executeRaw`
        UPDATE "YellowBookEntry" 
        SET embedding = ${JSON.stringify(embedding)}::float8[], 
            "embeddedAt" = NOW()
        WHERE id = ${business.id}
      `;

      completed++;
      console.log(`✅ [${completed}/${businesses.length}] ${business.name}\n`);

      // Rate limit: OpenAI-й 3 requests per minute
      await new Promise((resolve) => setTimeout(resolve, 20000));
    } catch (error) {
      failed++;
      console.error(`❌ Failed: ${business.name}`);
      console.error(error);
    }
  }

  console.log(`\n📈 Embedding дууссан:`);
  console.log(`   ✅ Completed: ${completed}`);
  console.log(`   ❌ Failed: ${failed}`);

  await prisma.$disconnect();
}

// Run embedding
embedAllBusinesses().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
