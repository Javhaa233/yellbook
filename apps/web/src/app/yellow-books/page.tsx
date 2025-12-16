import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone } from "lucide-react";

import { fetchYellowBookList } from "@/utils/trpc";
import type { YellowBookEntry } from "@lib/types";
import { BusinessListSkeleton } from "@/components/business-list-skeleton";

// Энэ route бүхэлдээ ISR (60s)
export const revalidate = 60;

// STREAMED SECTION – async server component
async function YellowBooksContent() {
  let entries: YellowBookEntry[] = [];
  
  try {
    entries = await fetchYellowBookList(
      {},
      {
        next: {
          revalidate: 60,
          tags: ["yellow-books-list"],
        },
      },
    );
  } catch (error) {
    console.error("Failed to fetch yellow books:", error);
    // Return empty array on fetch failure - page will render with no results
    entries = [];
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry: YellowBookEntry) => {
        const phoneContact = entry.contacts.find((c) => c.type === "phone");

        return (
          <Link key={entry.id} href={`/yellow-books/${entry.id}`}>
            <Card className="bg-white border-2 border-gray-300 cursor-pointer hover:shadow-lg transition-shadow h-full">
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                  {entry.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {entry.summary}
                </p>

                <div className="space-y-2 text-sm">
                  {entry.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 line-clamp-2">
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
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export default function YellowBooksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-50 border-b-2 border-blue-600 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Байгууллагын Жагсаалт
          </h1>
          <div className="flex flex-wrap gap-2">
            <Link href="/">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Нүүр рүү буцах
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
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* STREAMED SECTION + Suspense fallback */}
        <Suspense fallback={<BusinessListSkeleton />}>
          <YellowBooksContent />
        </Suspense>
      </main>
    </div>
  );
}
