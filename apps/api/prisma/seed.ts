import { PrismaClient, OrganizationKind } from '@prisma/client';

const prisma = new PrismaClient();

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
type SeedEntry = {
  name: string;
  shortName?: string;
  summary: string;
  description?: string;
  streetAddress: string;
  district: string;
  province: string;
  website?: string;
  email?: string;
  phone: string;
  secondaryPhone?: string;
  facebook?: string;
  instagram?: string;
  googleMapUrl?: string;
  hours?: string;
  latitude?: number;
  longitude?: number;
  kind: OrganizationKind;
  categorySlug: string;
  tagLabels: string[];
};
const entries: SeedEntry[] = [
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
  },{ name: 'Нийслэлийн Мэдээлэл Технологийн Газар',
  shortName: 'НИТГ',
  summary: 'Улаанбаатар хотын e-mongolia системийн дэмжлэг.',
  description:
    'НИТГ нь нийслэлийн цахим засаглал, e-mongolia үйлчилгээний дэд бүтцийг хариуцдаг.',
  streetAddress: 'Сүхбаатар дүүрэг, 1-р хороо, Жамъянгийн гудамж',
  district: 'Сүхбаатар',
  province: 'Улаанбаатар',
  website: 'https://niit.gov.mn',
  email: 'info@niit.gov.mn',
  phone: '+976 7011 0000',
  facebook: 'https://www.facebook.com/niit.gov.mn',
  instagram: undefined,
  googleMapUrl: 'https://www.google.com/maps?q=47.918273,106.917654',
  hours: 'Даваа–Баасан 08:30–17:30',
  latitude: 47.918273,
  longitude: 106.917654,
  kind: OrganizationKind.GOVERNMENT,
  categorySlug: 'government-services',
  tagLabels: ['цахим үйлчилгээ', 'үнэгүй зөвлөгөө']
  },{  name: 'Travel Mongolia Аялал Жуулчлал',
  shortName: 'Travel Mongolia',
  summary: 'Дотоод, гадаад аяллын тур оператор.',
  description:
    'Монгол орны аялал жуулчлалын үйлчилгээ үзүүлэгч мэргэжлийн оператор компани.',
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
  tagLabels: ['гадаад хэл', 'орон нутгийн салбар']
},{
  name: 'CU Сүлжээ Дэлгүүр',
  shortName: 'CU Mongolia',
  summary: '24/7 үйлчилгээтэй хүнсний сүлжээ дэлгүүр.',
  description:
    'CU нь Улаанбаатар хот даяар байрлах 24 цагийн супермаркет, хүнсний сүлжээ дэлгүүр.',
  streetAddress: 'Сүхбаатар дүүрэг, 1-р хороо, Сөүлийн гудамж',
  district: 'Сүхбаатар',
  province: 'Улаанбаатар',
  website: 'https://cumongolia.mn',
  email: 'info@cumongolia.mn',
  phone: '1800-3210',
  secondaryPhone: undefined,
  facebook: 'https://www.facebook.com/cumongolia',
  instagram: 'https://www.instagram.com/cu_mongolia',
  googleMapUrl: 'https://www.google.com/maps?q=47.920307,106.917595',
  hours: '24/7',
  latitude: 47.920307,
  longitude: 106.917595,
  kind: OrganizationKind.SERVICE,
  categorySlug: 'business-support',
  tagLabels: ['24/7', 'гэр бүлд ээлтэй']
},{
  name: 'Гранд Мед Эмнэлэг',
  shortName: 'Grand Med',
  summary: 'Мэс засал, оношилгооны төв.',
  description:
    'Гранд Мед эмнэлэг нь мэс заслын чиглэлээр мэргэшсэн, улсын хэмжээний тэргүүлэх эмнэлгүүдийн нэг.',
  streetAddress: 'Баянгол дүүрэг, 2-р хороо, Энхтайваны өргөн чөлөө',
  district: 'Баянгол',
  province: 'Улаанбаатар',
  website: 'https://grandmed.mn',
  email: 'info@grandmed.mn',
  phone: '+976 7011 0333',
  secondaryPhone: undefined,
  facebook: 'https://www.facebook.com/grandmedhospital',
  instagram: 'https://www.instagram.com/grandmed_hospital',
  googleMapUrl: 'https://www.google.com/maps?q=47.911727,106.874965',
  hours: 'Өдөр бүр 08:00–20:00',
  latitude: 47.911727,
  longitude: 106.874965,
  kind: OrganizationKind.SERVICE,
  categorySlug: 'healthcare',
  tagLabels: ['24/7', 'хөгжлийн бэрхшээлтэй иргэдэд ээлтэй']
},{
  name: 'АПУ ХК',
  shortName: 'APU',
  summary: 'Монголын хүнсний ууган үйлдвэрлэгч компани.',
  description:
    'АПУ ХК нь ундаа, сүү, ус, спиртийн үйлдвэртэй, Монголын томоохон хүнсний үйлдвэрлэгч юм.',
  streetAddress: 'Сонгинохайрхан дүүрэг, 20-р хороо, Үйлдвэрийн тойруу',
  district: 'Сонгинохайрхан',
  province: 'Улаанбаатар',
  website: 'https://www.apu.mn',
  email: 'info@apu.mn',
  phone: '+976 1800-1881',
  secondaryPhone: undefined,
  facebook: 'https://www.facebook.com/apucorp',
  instagram: 'https://www.instagram.com/apu.company',
  googleMapUrl: 'https://www.google.com/maps?q=47.921571,106.769984',
  hours: 'Даваа–Баасан 09:00–18:00',
  latitude: 47.921571,
  longitude: 106.769984,
  kind: OrganizationKind.BUSINESS,
  categorySlug: 'business-support',
  tagLabels: ['гэрээт үйлчилгээ', 'орон нутгийн салбар']
},{
    name: 'Ирээдүйн Оюун ТББ',
    summary: 'Залуусын STEAM боловсролыг дэмжих нийгмийн инновацын хөтөлбөрүүд.',
    description:
      'STEAM чиглэлийн сургалт, лаборатори, багш нарын мэргэжил дээшлүүлэх семинаруудыг зохион байгуулдаг ашгийн бус байгууллага.',
    streetAddress: 'Сонгинохайрхан дүүрэг, 18-р хороо, Их тойруу-27/4',
    district: 'Сонгинохайрхан',
    province: 'Улаанбаатар',
    phone: '+976 9400 6677',
    email: 'team@futuremind.mn',
    facebook: 'https://www.facebook.com/futuremn/',
    instagram: 'https://instagram.com/futuremind.mn',
    googleMapUrl: 'https://maps.google.com/maps?q=47.905346,106.828268&z=15&output=embed',
    hours: 'Мягмар-Ням 10:00-19:00',
    latitude: 47.905346,
    longitude: 106.828268,
    kind: OrganizationKind.NGO,
    categorySlug: 'ngo-community',
    tagLabels: ['үнэгүй зөвлөгөө', 'гадаад хэл', 'ногоон бодлого'],
  },
];

async function seed() {
  console.log('🌱 Seeding Yellow Book data...');

  const adminEmail = 'admin@yellbook.com';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any).user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
    },
    create: {
      email: adminEmail,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  await prisma.yellowBookEntryTag.deleteMany();
  await prisma.yellowBookEntry.deleteMany();
  await prisma.yellowBookTag.deleteMany();
  await prisma.yellowBookCategory.deleteMany();

  await Promise.all(
    categories.map((category) =>
      prisma.yellowBookCategory.create({
        data: category,
      }),
    ),
  );

  await Promise.all(
    tags.map((label) =>
      prisma.yellowBookTag.create({
        data: { label },
      }),
    ),
  );

  for (const entry of entries) {
    await prisma.yellowBookEntry.create({
      data: {
        name: entry.name,
        shortName: entry.shortName,
        summary: entry.summary,
        description: entry.description,
        streetAddress: entry.streetAddress,
        district: entry.district,
        province: entry.province,
        website: entry.website,
        email: entry.email,
        phone: entry.phone,
        secondaryPhone: entry.secondaryPhone,
        facebook: entry.facebook,
        instagram: entry.instagram,
        googleMapUrl: entry.googleMapUrl,
        hours: entry.hours,
        latitude: entry.latitude,
        longitude: entry.longitude,
        kind: entry.kind,
        category: {
          connect: { slug: entry.categorySlug },
        },
        tags: {
          create: entry.tagLabels.map((label) => ({
            tag: {
              connect: { label },
            },
          })),
        },
      },
    });
  }

  console.log('✅ Seed finished');
}


seed()
  .catch((error) => {
    console.error('❌ Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });