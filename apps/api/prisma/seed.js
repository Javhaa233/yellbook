const { PrismaClient, OrganizationKind } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

async function seed() {
  // Ensure an ADMIN user exists (Lab OAuth/RBAC requirement).
  await prisma.user.upsert({
    where: { email: 'admin@yellbook.com' },
    update: { role: 'ADMIN', name: 'Admin' },
    create: { email: 'admin@yellbook.com', name: 'Admin', role: 'ADMIN' },
  });

  const categories = [
    {
      slug: 'government-services',
      name: 'Төрийн үйлчилгээ',
      description: 'Иргэдэд зориулсан төрийн байгууллагуудын нэг цонхны үйлчилгээ.',
    },
    {
      slug: 'education-training',
      name: 'Боловсрол & сургалт',
      description: 'Сургалт, хөгжлийн төвүүд болон их дээд сургуулиуд.',
    },
    {
      slug: 'healthcare',
      name: 'Эрүүл мэнд',
      description: 'Эмнэлэг, клиник, урьдчилан сэргийлэх төвүүд.',
    },
    {
      slug: 'business-support',
      name: 'Бизнесийн дэмжлэг',
      description: 'Санхүү, зөвлөх үйлчилгээ болон бизнесийн холбоод.',
    },
    {
      slug: 'tourism',
      name: 'Аялал жуулчлал',
      description: 'Соёл, аялал жуулчлалын байгууллагууд.',
    },
    {
      slug: 'ngo-community',
      name: 'ТББ & нийгэм',
      description: 'Олон нийтийн байгууллага, сангууд.',
    },
  ];

  const tags = [
    'цахим үйлчилгээ',
    'цахим захиалга',
    '24/7',
    'гадаад хэл',
    'хөгжлийн бэрхшээлтэй иргэдэд ээлтэй',
    'үнэгүй зөвлөгөө',
    'гэрээт үйлчилгээ',
    'орон нутгийн салбар',
    'гэр бүлд ээлтэй',
    'ногоон бодлого',
  ];

  const entries = [
    {
      name: 'Нэг цонхны үйлчилгээний төв',
      shortName: 'One Stop',
      summary: 'Иргэний бүртгэл, нийгмийн даатгал болон татварын үйлчилгээг нэг дороос.',
      description:
        'Иргэд төрийн суурь үйлчилгээг нэг дороос авах боломжтой интеграцласан үйлчилгээний төв.',
      streetAddress: 'Сүхбаатар дүүрэг, 8-р хороо, Их сургуулийн гудамж-12',
      district: 'Сүхбаатар',
      province: 'Улаанбаатар',
      website: 'https://egov.mn',
      email: 'info@egov.mn',
      phone: '+976 11 123456',
      secondaryPhone: '1800-1200',
      facebook: 'https://facebook.com/egovmn',
      googleMapUrl: 'https://maps.google.com/maps?q=47.918531,106.917701&z=16&output=embed',
      hours: 'Даваа-Баасан 09:00-18:00, Бямба 10:00-14:00',
      latitude: 47.918531,
      longitude: 106.917701,
      kind: OrganizationKind.GOVERNMENT,
      categorySlug: 'government-services',
      tagLabels: ['цахим үйлчилгээ', 'орон нутгийн салбар', '24/7'],
    },
    {
      name: 'Улаанбаатарын Инновацын Төв',
      shortName: 'UB Innovation Hub',
      summary: 'Стартап, ЖДҮ-д зориулсан инновацын лаборатори, коворкинг ба акселератор.',
      description:
        'Инновацын төв нь гарааны компаниудад менторшип, хөрөнгө оруулалт татах сургалт, туршилтын лабораторийн орчинг бүрдүүлдэг.',
      streetAddress: 'Чингэлтэй дүүрэг, 1-р хороо, Жуулчны гудамж-45',
      district: 'Чингэлтэй',
      province: 'Улаанбаатар',
      website: 'https://ubinnovation.mn',
      email: 'hello@ubinnovation.mn',
      phone: '+976 7000 8899',
      instagram: 'https://instagram.com/ubinnovation',
      googleMapUrl: 'https://maps.google.com/maps?q=47.919806,106.905735&z=16&output=embed',
      hours: 'Даваа-Баасан 08:30-20:00',
      latitude: 47.919806,
      longitude: 106.905735,
      kind: OrganizationKind.BUSINESS,
      categorySlug: 'business-support',
      tagLabels: ['цахим захиалга', 'үнэгүй зөвлөгөө', 'гэрээт үйлчилгээ'],
    },
    {
      name: 'Монгол Улсын Үндэсний Номын Сан',
      shortName: 'Үндэсний номын сан',
      summary: 'Судалгааны төв, номын сангийн өргөн сонголттой үндэсний соёлын өв.',
      description:
        'Соёлын өвийг хадгалах, уншигчдад судалгааны эх сурвалжийг олгох Үндэсний хэмжээний номын сан. Хөгжлийн бэрхшээлтэй иргэдэд зориулсан тусгай уншлагын танхимтай.',
      streetAddress: 'Сүхбаатар дүүрэг, 8-р хороо, Ж.Самбуугийн гудамж-11',
      district: 'Сүхбаатар',
      province: 'Улаанбаатар',
      website: 'https://nlm.mn',
      email: 'contact@nlm.mn',
      phone: '+976 11 321830',
      facebook: 'https://facebook.com/nlmongolia',
      googleMapUrl: 'https://maps.google.com/maps?q=47.918786,106.917312&z=16&output=embed',
      hours: 'Даваа-Баасан 08:30-17:30, Бямба 10:00-15:00',
      latitude: 47.918786,
      longitude: 106.917312,
      kind: OrganizationKind.MUNICIPAL,
      categorySlug: 'education-training',
      tagLabels: ['хөгжлийн бэрхшээлтэй иргэдэд ээлтэй', 'орон нутгийн салбар'],
    },
    {
      name: 'Мөнх Шим Эко Эмнэлэг',
      summary: 'Уламжлалт анагаах ухаан болон орчин үеийн оношлогооны цогц үйлчилгээ.',
      description:
        'Өрхийн болон уламжлалт анагаахын эмчилгээ, рашаан сувилал, хоол зүйчийн зөвлөгөө бүхий интеграцласан эрүүл мэндийн төв.',
      streetAddress: 'Баянгол дүүрэг, 3-р хороо, Энхтайваны өргөн чөлөө-89',
      district: 'Баянгол',
      province: 'Улаанбаатар',
      phone: '+976 7700 5577',
      secondaryPhone: '+976 9911 2244',
      website: 'https://munhshim.mn',
      email: 'care@munhshim.mn',
      facebook: 'https://facebook.com/munhshim',
      googleMapUrl: 'https://maps.google.com/maps?q=47.908174,106.889816&z=16&output=embed',
      hours: 'Өдөр бүр 09:00-21:00',
      latitude: 47.908174,
      longitude: 106.889816,
      kind: OrganizationKind.SERVICE,
      categorySlug: 'healthcare',
      tagLabels: ['24/7', 'гэр бүлд ээлтэй'],
    },
    {
      name: 'Монголын Аялал Жуулчлалын Холбоо',
      shortName: 'MATA',
      summary: 'Аялал жуулчлалын салбарын мэргэжлийн холбоо, стандарт, сургалтыг зохицуулдаг.',
      description:
        'Гишүүн байгууллагуудын эрх ашгийг хамгаалах, салбарын бодлогыг боловсронгуй болгох, олон улсын түншлэл бий болгох зорилготой ашгийн бус байгууллага.',
      streetAddress: 'Хан-Уул дүүрэг, 11-р хороо, Их сургуулийн гудамж-5/3',
      district: 'Хан-Уул',
      province: 'Улаанбаатар',
      website: 'https://travelmongolia.org',
      email: 'info@travelmongolia.org',
      phone: '+976 11 312006',
      facebook: 'https://facebook.com/travelmongolia',
      googleMapUrl: 'https://maps.google.com/maps?q=47.902245,106.915452&z=15&output=embed',
      hours: 'Даваа-Баасан 09:00-18:00',
      latitude: 47.902245,
      longitude: 106.915452,
      kind: OrganizationKind.NGO,
      categorySlug: 'tourism',
      tagLabels: ['орон нутгийн салбар', 'ногоон бодлого'],
    },
    {
      name: 'Нийслэлийн Мэдээлэл Технологийн Газар',
      shortName: 'НИТГ',
      summary: 'Улаанбаатар хотын e-mongolia системийн дэмжлэг.',
      description: 'НИТГ нь нийслэлийн цахим засаглал, e-mongolia үйлчилгээний дэд бүтцийг хариуцдаг.',
      streetAddress: 'Сүхбаатар дүүрэг, 1-р хороо, Жамъянгийн гудамж',
      district: 'Сүхбаатар',
      province: 'Улаанбаатар',
      website: 'https://niit.gov.mn',
      email: 'info@niit.gov.mn',
      phone: '+976 7011 0000',
      facebook: 'https://www.facebook.com/niit.gov.mn',
      googleMapUrl: 'https://www.google.com/maps?q=47.918273,106.917654',
      hours: 'Даваа–Баасан 08:30–17:30',
      latitude: 47.918273,
      longitude: 106.917654,
      kind: OrganizationKind.GOVERNMENT,
      categorySlug: 'government-services',
      tagLabels: ['цахим үйлчилгээ', 'үнэгүй зөвлөгөө'],
    },
    {
      name: 'Travel Mongolia Аялал Жуулчлал',
      shortName: 'Travel Mongolia',
      summary: 'Дотоод, гадаад аяллын тур оператор.',
      description: 'Монгол орны аялал жуулчлалын үйлчилгээ үзүүлэгч мэргэжлийн оператор компани.',
      streetAddress: 'Хан-Уул дүүрэг, 15-р хороо',
      district: 'Хан-Уул',
      province: 'Улаанбаатар',
      website: 'https://travel-mongolia.com',
      email: 'info@travel-mongolia.com',
      phone: '+976 9911 5678',
      facebook: 'https://www.facebook.com/travelmongolia',
      instagram: 'https://www.instagram.com/travelmongolia',
      googleMapUrl: 'https://www.google.com/maps?q=47.8991,106.8284',
      hours: 'Даваа–Баасан 09:00–18:00',
      latitude: 47.8991,
      longitude: 106.8284,
      kind: OrganizationKind.NGO,
      categorySlug: 'tourism',
      tagLabels: ['гадаад хэл', 'орон нутгийн салбар'],
    },
    {
      name: 'CU Сүлжээ Дэлгүүр',
      shortName: 'CU Mongolia',
      summary: '24/7 үйлчилгээтэй хүнсний сүлжээ дэлгүүр.',
      description: 'CU нь Улаанбаатар хот даяар байрлах 24 цагийн супермаркет, хүнсний сүлжээ дэлгүүр.',
      streetAddress: 'Сүхбаатар дүүрэг, 1-р хороо, Сөүлийн гудамж',
      district: 'Сүхбаатар',
      province: 'Улаанбаатар',
      website: 'https://cumongolia.mn',
      email: 'info@cumongolia.mn',
      phone: '1800-3210',
      facebook: 'https://www.facebook.com/cumongolia',
      instagram: 'https://www.instagram.com/cu_mongolia',
      googleMapUrl: 'https://www.google.com/maps?q=47.920307,106.917595',
      hours: '24/7',
      latitude: 47.920307,
      longitude: 106.917595,
      kind: OrganizationKind.SERVICE,
      categorySlug: 'business-support',
      tagLabels: ['24/7', 'гэр бүлд ээлтэй'],
    },
    {
      name: 'Гранд Мед Эмнэлэг',
      shortName: 'Grand Med',
      summary: 'Мэс засал, оношилгооны төв.',
      description: 'Гранд Мед эмнэлэг нь мэс заслын чиглэлээр мэргэшсэн, улсын хэмжээний тэргүүлэх эмнэлгүүдийн нэг.',
      streetAddress: 'Баянгол дүүрэг, 2-р хороо, Энхтайваны өргөн чөлөө',
      district: 'Баянгол',
      province: 'Улаанбаатар',
      website: 'https://grandmed.mn',
      email: 'info@grandmed.mn',
      phone: '+976 7011 0333',
      facebook: 'https://www.facebook.com/grandmedhospital',
      instagram: 'https://www.instagram.com/grandmed_hospital',
      googleMapUrl: 'https://www.google.com/maps?q=47.911727,106.874965',
      hours: 'Өдөр бүр 08:00–20:00',
      latitude: 47.911727,
      longitude: 106.874965,
      kind: OrganizationKind.SERVICE,
      categorySlug: 'healthcare',
      tagLabels: ['24/7', 'хөгжлийн бэрхшээлтэй иргэдэд ээлтэй'],
    },
  ];

  // Optional: compute embeddings in-cluster (needed for AI search).
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  const EMBEDDING_MODEL = 'text-embedding-004';

  async function getEmbedding(text) {
    if (!GEMINI_API_KEY) return null;
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${GEMINI_API_KEY}`,
      {
        model: `models/${EMBEDDING_MODEL}`,
        content: {
          parts: [{ text }],
        },
      },
      { headers: { 'Content-Type': 'application/json' } },
    );
    return response.data.embedding.values;
  }

  // Categories (slug is unique)
  for (const c of categories) {
    await prisma.yellowBookCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: c,
    });
  }

  // Tags (label is unique)
  for (const label of tags) {
    await prisma.yellowBookTag.upsert({
      where: { label },
      update: {},
      create: { label },
    });
  }

  // Entries (no unique constraint, so we dedupe by (name + categorySlug) best-effort)
  for (const e of entries) {
    const existing = await prisma.yellowBookEntry.findFirst({
      where: {
        name: e.name,
        category: { slug: e.categorySlug },
      },
      select: { id: true },
    });

    const entryDataBase = {
      name: e.name,
      shortName: e.shortName,
      summary: e.summary,
      description: e.description,
      streetAddress: e.streetAddress,
      district: e.district,
      province: e.province,
      website: e.website,
      email: e.email,
      phone: e.phone,
      secondaryPhone: e.secondaryPhone,
      facebook: e.facebook,
      instagram: e.instagram,
      googleMapUrl: e.googleMapUrl,
      hours: e.hours,
      latitude: e.latitude,
      longitude: e.longitude,
      kind: e.kind,
      category: {
        connect: { slug: e.categorySlug },
      },
    };

    const tagsCreate = (e.tagLabels || []).map((label) => ({
      tag: { connect: { label } },
    }));

    let entryId;
    if (existing) {
      // Clear tag join rows first (nested deleteMany isn't allowed on create/update input here)
      await prisma.yellowBookEntryTag.deleteMany({
        where: { entryId: existing.id },
      });

      const updated = await prisma.yellowBookEntry.update({
        where: { id: existing.id },
        select: { id: true },
        data: {
          ...entryDataBase,
          tags: {
            create: tagsCreate,
          },
        },
      });
      entryId = updated.id;
    } else {
      const created = await prisma.yellowBookEntry.create({
        select: { id: true },
        data: {
          ...entryDataBase,
          tags: {
            create: tagsCreate,
          },
        },
      });
      entryId = created.id;
    }

    // If a Gemini API key is provided, embed the entry for AI search.
    if (GEMINI_API_KEY && entryId) {
      try {
        const text = [
          e.name,
          e.shortName,
          e.summary,
          e.description,
          e.district,
          e.province,
          e.categorySlug,
          ...(e.tagLabels || []),
        ]
          .filter(Boolean)
          .join(' ');

        const embedding = await getEmbedding(text);
        if (Array.isArray(embedding) && embedding.length > 0) {
          await prisma.yellowBookEntry.update({
            where: { id: entryId },
            data: {
              embedding,
              embeddedAt: new Date(),
            },
          });
        }
      } catch (err) {
        console.error('Embedding failed (continuing without embedding):', err);
      }
    }
  }

  // eslint-disable-next-line no-console
  console.log('✅ Seed finished');
}

seed()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error('❌ Seed failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
