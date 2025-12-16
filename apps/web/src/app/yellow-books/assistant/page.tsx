'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, MessageCircle, Send, MapPin, Phone, Tag, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
  id: string;
  name: string;
  summary: string;
  similarity: number;
  distance: number;
  category?: string;
  district?: string;
  phone?: string;
  matchReason?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  results?: SearchResult[];
  timestamp: Date;
}

// Example queries for suggestions
const EXAMPLE_QUERIES = [
  "Сайн үнэтэй ресторан",
  "Хуульч, өмгөөлөгч",
  "Барилгын компани",
  "Эмнэлэг, эмийн сан",
  "Банк, санхүүгийн үйлчилгээ",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [cacheStats, setCacheStats] = useState({ hits: 0, misses: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  
  const apiBase = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '');

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const url = apiBase ? `${apiBase}/api/ai/yellow-books/search` : '/api/ai/yellow-books/search';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: input.trim(),
          limit: 5,
          useCache: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const results: SearchResult[] = await response.json();

      // Format assistant response
      let assistantContent = '';
      if (results.length === 0) {
        assistantContent = "Сайн уу! Уг асуултаар ямар нэг үр дүн олдсонгүй. Өөр асуулт оруулна уу.";
      } else {
        assistantContent = `${results.length} үр дүн олдлоо.`;
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: assistantContent,
        results,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // Update cache stats based on response headers if available
      const cacheHit = response.headers.get('x-cache-hit');
      if (cacheHit === 'true') {
        setCacheStats((prev) => ({ ...prev, hits: prev.hits + 1 }));
      } else {
        setCacheStats((prev) => ({ ...prev, misses: prev.misses + 1 }));
      }
    } catch (error) {
      console.error('Search error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: '❌ Хайлт сүтэй байна. Дахин оролдоно уу.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      const url = apiBase ? `${apiBase}/api/ai/yellow-books/cache` : '/api/ai/yellow-books/cache';
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCacheStats({ hits: 0, misses: 0 });
        const message: Message = {
          role: 'assistant',
          content: '🧹 Cache цэвэрлэгдлээ!',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, message]);
      }
    } catch (error) {
      console.error('Clear cache error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Шар Номын Туслах
            </h1>
          </div>
          <p className="text-gray-600">
            AI-г ашиглан бизнес, сэвс, үйлчилгээ хайна
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {cacheStats.hits}
                </div>
                <div className="text-sm text-gray-600">Cache Hits</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {cacheStats.misses}
                </div>
                <div className="text-sm text-gray-600">Cache Misses</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages */}
        <Card className="h-[500px] mb-6 overflow-y-auto bg-white shadow-lg">
          <CardContent className="p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="mb-4">Ассистентад асуулт түгээрэй...</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {EXAMPLE_QUERIES.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(q)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'user' ? (
                      <div className="max-w-md px-4 py-2 rounded-lg bg-blue-600 text-white rounded-br-none">
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString('mn-MN')}
                      </p>
                    </div>
                  ) : (
                    <div className="max-w-2xl w-full">
                      {msg.results && msg.results.length > 0 ? (
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600 mb-2">
                            🔍 {msg.results.length} үр дүн олдлоо:
                          </p>
                          {msg.results.map((result, i) => (
                            <div
                              key={result.id}
                              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <Link 
                                    href={`/yellow-books/${result.id}`}
                                    className="font-semibold text-blue-600 hover:underline flex items-center gap-1"
                                  >
                                    {i + 1}. {result.name}
                                    <ExternalLink className="w-3 h-3" />
                                  </Link>
                                  <p className="text-sm text-gray-600 mt-1">{result.summary}</p>
                                  <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                                    {result.category && (
                                      <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                                        <Tag className="w-3 h-3" />
                                        {result.category}
                                      </span>
                                    )}
                                    {result.district && (
                                      <span className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                                        <MapPin className="w-3 h-3" />
                                        {result.district}
                                      </span>
                                    )}
                                    {result.phone && (
                                      <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                                        <Phone className="w-3 h-3" />
                                        {result.phone}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right ml-4">
                                  <div className="text-lg font-bold text-green-600">
                                    {(result.similarity * 100).toFixed(0)}%
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {result.matchReason || 'таарц'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-100 text-gray-900 rounded-lg rounded-bl-none px-4 py-2">
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {msg.timestamp.toLocaleTimeString('mn-MN')}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </CardContent>
        </Card>

        {/* Input Form */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <Input
                placeholder="Та юу хайж байна? (жнь: Ресторан, Барлаа, Ажлын газар)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Хайж байна...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Илгээх
                  </>
                )}
              </Button>
            </form>

            {/* Clear Cache Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCache}
              className="mt-4 w-full"
            >
              🧹 Cache цэвэрлэх
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            💡 Сайн уу! Бид OpenAI embeddings болон Redis cache ашиглаж
            байна.
          </p>
          <p className="mt-2 text-xs">
            © 2025 Yellow Book Assistant - All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
