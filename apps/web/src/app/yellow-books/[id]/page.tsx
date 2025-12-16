import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { fetchYellowBookDetail } from "@/utils/trpc";

// Энэ page-ийг ISR маягаар cache-лана
export const revalidate = 60;

// Build үед dynamic SSG хийхгүй — энэ нь CI дээр fetch алдаа гаргахгүй болгоно
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const entry = await fetchYellowBookDetail(id, {
      next: { tags: ["yellow-books-detail"] },
    });

    return {
      title: `${entry.name} - ШАР НОМ`,
      description: entry.summary,
    };
  } catch (error) {
    console.error("Failed to fetch metadata for:", id, error);
    return {
      title: "ШАР НОМ",
      description: "Монголын байгууллагуудын мэдээллийн сан",
    };
  }
}

export default async function YellowBookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const entry = await fetchYellowBookDetail(id, {
    next: { tags: ["yellow-books-detail"] },
  }).catch(() => null);

  if (!entry) {
    notFound();
  }

  const phoneContact = entry.contacts.find((c) => c.type === "phone");
  const emailContact = entry.contacts.find((c) => c.type === "email");
  const websiteContact = entry.contacts.find((c) => c.type === "website");
  const facebookContact = entry.contacts.find((c) => c.type === "facebook");
  const instagramContact = entry.contacts.find((c) => c.type === "instagram");
  const mapContact = entry.contacts.find((c) => c.type === "map");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-50 border-b-2 border-blue-600 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <Link href="/yellow-books">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                ← Буцах
              </Button>
            </Link>
            <Link href="/yellow-books/assistant">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                AI Search
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-800">{entry.name}</h1>
          <p className="text-gray-600 mt-2">{entry.category.name}</p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="bg-white border-2 border-gray-300 mb-6">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Танилцуулга
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {entry.description || entry.summary}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-gray-300 mb-6">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Холбоо барих мэдээлэл
                </h2>

                <div className="space-y-4">
                  {entry.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Байршил
                        </h3>
                        <p className="text-gray-700">
                          {entry.address.streetAddress}
                          <br />
                          {entry.address.district}, {entry.address.province}
                        </p>
                      </div>
                    </div>
                  )}

                  {phoneContact && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Утасны дугаар
                        </h3>
                        <a
                          href={`tel:${phoneContact.value}`}
                          className="text-blue-600 hover:underline font-semibold"
                        >
                          {phoneContact.value}
                        </a>
                      </div>
                    </div>
                  )}

                  {emailContact && (
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-800">Имэйл</h3>
                        <a
                          href={`mailto:${emailContact.value}`}
                          className="text-blue-600 hover:underline"
                        >
                          {emailContact.value}
                        </a>
                      </div>
                    </div>
                  )}

                  {entry.hours && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Ажлын цаг
                        </h3>
                        <p className="text-gray-700">{entry.hours}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-white border-2 border-gray-300 sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Холбоо барих
                </h2>

                <div className="space-y-3 mb-6">
                  {phoneContact && (
                    <a href={`tel:${phoneContact.value}`}>
                      <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                        Залгах
                      </Button>
                    </a>
                  )}

                  {emailContact && (
                    <a href={`mailto:${emailContact.value}`}>
                      <Button
                        variant="outline"
                        className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        Имэйл илгээх
                      </Button>
                    </a>
                  )}

                  {mapContact && (
                    <a
                      href={mapContact.value}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        Газрын зураг
                      </Button>
                    </a>
                  )}
                </div>

                <div className="border-t border-gray-300 pt-6">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Сошиал сүлжээнүүд
                  </h3>
                  <div className="flex gap-3">
                    {facebookContact && (
                      <a
                        href={facebookContact.value}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook className="h-6 w-6 text-blue-600 hover:text-blue-700 cursor-pointer" />
                      </a>
                    )}
                    {instagramContact && (
                      <a
                        href={instagramContact.value}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram className="h-6 w-6 text-blue-600 hover:text-blue-700 cursor-pointer" />
                      </a>
                    )}
                    {websiteContact && (
                      <a
                        href={websiteContact.value}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="h-6 w-6 text-blue-600 hover:text-blue-700 cursor-pointer" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
