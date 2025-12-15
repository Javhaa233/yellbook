const { PrismaClient, OrganizationKind } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();

  // Ensure an ADMIN user exists for Lab 8 role-based access.
  await prisma.user.upsert({
    where: { email: 'admin@yellbook.com' },
    update: { role: 'ADMIN' },
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
        'Иргэд төрийн суурь үйлчилгээг нэг дороос авах боломжтой интеграцласан үйлчилгээний төв. Өндөр ачаалалтай өдрүүдэд цахим дугаарлалт ашиглан урьдчилан цаг авах боломжтой.',
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
      tagLabels: ['гэрээт үйлчилгээ', 'үнэгүй зөвлөгөө', 'цахим захиалга'],
    },
  ];

  // Upsert categories
  const categoryIdBySlug = new Map();
  for (const c of categories) {
    const created = await prisma.yellowBookCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: c,
    });
    categoryIdBySlug.set(c.slug, created.id);
  }

  // Upsert tags
  const tagIdByLabel = new Map();
  for (const label of tags) {
    const created = await prisma.yellowBookTag.upsert({
      where: { label },
      update: {},
      create: { label },
    });
    tagIdByLabel.set(label, created.id);
  }

  // Upsert entries
  for (const e of entries) {
    const categoryId = categoryIdBySlug.get(e.categorySlug);
    if (!categoryId) continue;

    const entry = await prisma.yellowBookEntry.upsert({
      where: {
        // There's no unique constraint on name, so use a best-effort approach.
        // If this becomes an issue, add a unique field in schema.
        id: undefined,
      },
      update: {},
      create: {
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
        categoryId,
      },
    }).catch(async () => {
      // Fallback: create (since we don't have a unique key)
      return prisma.yellowBookEntry.create({
        data: {
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
          categoryId,
        },
      });
    });

    // Attach tags
    for (const label of e.tagLabels ?? []) {
      const tagId = tagIdByLabel.get(label);
      if (!tagId) continue;
      await prisma.yellowBookEntryTag.upsert({
        where: { entryId_tagId: { entryId: entry.id, tagId } },
        update: {},
        create: { entryId: entry.id, tagId },
      });
    }
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
