'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { YellowBookCategory } from '@lib/types';

interface SearchBarProps {
  categories: YellowBookCategory[] | null | undefined;
}

export function SearchBar({ categories }: SearchBarProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const router = useRouter();

  const navigate = (query?: string, categorySlug?: string) => {
    const params = new URLSearchParams();

    const trimmed = query?.trim();
    if (trimmed) params.set('q', trimmed);
    if (categorySlug) params.set('categorySlug', categorySlug);

    const qs = params.toString();
    router.push(qs ? `/yellow-books/search?${qs}` : '/yellow-books');
  };

  const handleSearch = (): void => {
    navigate(inputValue, selectedCategory);
  };

  return (
    <section className="bg-gray-100 border-b-2 border-gray-300">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <p className="text-gray-700 font-semibold mb-3">Түлхүүр үгээр хайна уу.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Байгууллага, үйлчилгээ, байршилаар хайх ..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 border-2 border-gray-300 bg-white"
              />
            </div>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleSearch}
            >
              Хайх
            </Button>
            <Link href="/yellow-books/assistant">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                AI Search
              </Button>
            </Link>
            {(inputValue.trim() || selectedCategory) && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setInputValue("");
                  setSelectedCategory(undefined);
                  router.push('/');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCategory(undefined);
                navigate(inputValue, undefined);
              }}
              className={selectedCategory === undefined ? "bg-blue-600 text-white" : "bg-gray-200"}
            >
              Бүх үйлчилгээ
            </Button>
            {categories && categories.map((category: YellowBookCategory) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedCategory(category.slug);
                  navigate(inputValue, category.slug);
                }}
                className={
                  selectedCategory === category.slug
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
