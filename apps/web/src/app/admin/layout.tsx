import { requireAdminSession } from "@/lib/server-auth";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will automatically redirect if not authenticated as admin
  const session = await requireAdminSession();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Admin Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link
                href="/admin"
                className="font-semibold hover:text-blue-400"
              >
                🔐 Admin Panel
              </Link>
              <Link
                href="/admin/users"
                className="text-gray-300 hover:text-white"
              >
                Users
              </Link>
              <Link
                href="/admin/businesses"
                className="text-gray-300 hover:text-white"
              >
                Businesses
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">
                {session?.user?.email}
              </span>
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
