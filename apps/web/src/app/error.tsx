"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Алдаа гарлаа</h1>
        <p className="text-gray-600 mb-8">{error.message || "Ямар нэгэн алдаа гарсан байна"}</p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Дахин оролдох
        </button>
      </div>
    </div>
  );
}
