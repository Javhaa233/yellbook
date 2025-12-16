"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";

import { fetchYellowBookList } from "@/utils/trpc";
import type { YellowBookEntry } from "@lib/types";

type Props = {
  query: string;
  categorySlug?: string;
};

export default function YellowBooksMapIsland({ query, categorySlug }: Props) {
  const { data: entries } = useSuspenseQuery({
    queryKey: ["yellow-books-map", query, categorySlug ?? ""],
    queryFn: () =>
      fetchYellowBookList({
        search: query ? query : undefined,
        categorySlug,
      }),
  });

  return (
    <section className="border rounded-lg p-4 bg-white shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Газрын зураг (client island)
      </h2>

      {entries.length === 0 ? (
        <p className="text-sm text-gray-500">
          Энэ хайлтад газрын зураг дээр харагдах байгууллага алга.
        </p>
      ) : (
        <div className="space-y-2 text-sm max-h-72 overflow-auto">
          {entries.map((entry: YellowBookEntry) => (
            <div
              key={entry.id}
              className="flex items-start gap-2 border-b pb-2 last:border-b-0 last:pb-0"
            >
              <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800 line-clamp-1">
                  {entry.name}
                </p>
                {entry.address && (
                  <p className="text-gray-600 line-clamp-1">
                    {entry.address.district}, {entry.address.province}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Жинхэнэ map library (Leaflet / Mapbox) интеграц хийх орон зай */}
      <p className="mt-3 text-[11px] text-gray-400">
        * Одоохондоо жагсаалт хэлбэрээр байршуулж байна. Дараа нь Leaflet / Mapbox
        зэрэгтэй холбож, жинхэнэ map болгож өргөтгөх боломжтой.
      </p>
    </section>
  );
}
