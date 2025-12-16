import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Хуудас олдсонгүй
      </h1>

      <p className="text-gray-600 mb-6 text-center max-w-md">
        Таны хайж буй хуудас олдсонгүй. Доорх товчийг дарж Шар номын лавлах
        руу буцна уу.
      </p>

      <Link href="/yellow-books">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
          Шар номын жагсаалт руу буцах
        </Button>
      </Link>
    </div>
  );
}
