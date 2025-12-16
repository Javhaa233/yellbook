import Link from "next/link";
import { Clock, Facebook, Globe, Instagram, Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { fetchYellowBookCategories, fetchYellowBookList } from "@/utils/trpc";
import type { YellowBookEntry, YellowBookCategory } from "@lib/types";
import { SearchBar } from "@/components/search-bar";
import LoginClient from "./login/LoginClient";
import { getAuthSession } from "@/lib/server-auth";

export const revalidate = 60;

export default async function HomePage() {
  const session = await getAuthSession();
  if (!session) {
    return <LoginClient />;
  }

  let entries: YellowBookEntry[] = [];
  let categories: YellowBookCategory[] = [];

  try {
    const [entriesData, categoriesData] = await Promise.all([
      fetchYellowBookList({}),
      fetchYellowBookCategories(),
    ]);
    entries = entriesData || [];
    categories = categoriesData || [];
  } catch (error) {
    console.error("Failed to fetch home page data:", error);
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="border-b-4 border-blue-600 bg-blue-50/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-blue-700 mb-2">ШАР НОМ ЦАХИМ СИСТЕМ</h1>
            <p className="text-lg text-gray-700">Монголын байгууллагуудын мэдээллийн сан • YellBook</p>
            <div className="w-32 h-1 bg-blue-600 mx-auto mt-4"></div>
          </div>
        </div>
      </header>

      <SearchBar categories={categories} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <p className="text-gray-700 font-semibold">
              Нийт {entries.length} байгууллага
            </p>
          </div>

          <div className="grid gap-4">
            {entries && entries.length > 0 ? (
              entries.map((entry: YellowBookEntry) => {
                const phoneContact = entry.contacts?.find((c) => c.type === "phone");
                const emailContact = entry.contacts?.find((c) => c.type === "email");
                const websiteContact = entry.contacts?.find((c) => c.type === "website");
                const facebookContact = entry.contacts?.find((c) => c.type === "facebook");
                const instagramContact = entry.contacts?.find((c) => c.type === "instagram");
                const mapContact = entry.contacts?.find((c) => c.type === "map");

                return (
                  <Card key={entry.id} className="bg-white border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row gap-4">
                        <div className="w-24 h-24 bg-blue-100 flex items-center justify-center rounded font-bold text-gray-600 flex-shrink-0">
                          {entry.name?.substring(0, 2).toUpperCase() || "YB"}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <Link href={`/yellow-books/${entry.id}`}>
                              <h2 className="text-xl font-bold text-gray-800 hover:underline cursor-pointer">
                                {entry.name}
                              </h2>
                            </Link>
                            {entry.category && (
                              <Badge className="bg-blue-600 text-white">
                                {entry.category.name}
                              </Badge>
                            )}
                          </div>

                          <p className="text-gray-600 mb-3 text-sm">{entry.summary}</p>

                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div className="space-y-2">
                              {entry.address && (
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-700">
                                    {entry.address.streetAddress}
                                    <br />
                                    {entry.address.district}, {entry.address.province}
                                  </span>
                                </div>
                              )}
                              {phoneContact && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-gray-600 flex-shrink-0" />
                                  <span className="font-semibold text-gray-800">
                                    {phoneContact.value}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              {emailContact && (
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-gray-600 flex-shrink-0" />
                                  <span className="text-gray-700">{emailContact.value}</span>
                                </div>
                              )}
                              {entry.hours && (
                                <div className="flex items-start gap-2">
                                  <Clock className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-700">{entry.hours}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mt-3">
                            {facebookContact && (
                              <a href={facebookContact.value} target="_blank" rel="noopener noreferrer">
                                <Facebook className="h-4 w-4 text-gray-600 hover:text-blue-600 cursor-pointer" />
                              </a>
                            )}
                            {instagramContact && (
                              <a href={instagramContact.value} target="_blank" rel="noopener noreferrer">
                                <Instagram className="h-4 w-4 text-gray-600 hover:text-blue-600 cursor-pointer" />
                              </a>
                            )}
                            {websiteContact && (
                              <a href={websiteContact.value} target="_blank" rel="noopener noreferrer">
                                <Globe className="h-4 w-4 text-gray-600 hover:text-blue-600 cursor-pointer" />
                              </a>
                            )}
                            {mapContact && (
                              <a href={mapContact.value} target="_blank" rel="noopener noreferrer">
                                <MapPin className="h-4 w-4 text-gray-600 hover:text-blue-600 cursor-pointer" />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="lg:w-40 flex lg:flex-col gap-2">
                          {phoneContact && (
                            <a href={`tel:${phoneContact.value}`}>
                              <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 text-sm">
                                Дуудах
                              </Button>
                            </a>
                          )}
                          {mapContact && (
                            <a href={mapContact.value} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 text-sm">
                                Чиглэл авах
                              </Button>
                            </a>
                          )}
                          <Link href={`/yellow-books/${entry.id}`}>
                            <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100 text-sm">
                              Дэлгэрэнгүй
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Байгууллага олдсонгүй.</p>
                <p className="text-gray-500 mt-2">Та дараа дахин оролдоно уу.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-blue-600 text-white py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="font-bold">Монголын шар ном</p>
          <p className="text-sm mt-1">© 2025 Шар ном. Бүх эрх хүлээлэгдсэн.</p>
        </div>
      </footer>
    </div>
  );
}
