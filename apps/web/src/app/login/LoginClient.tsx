"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function LoginClient() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const error_param = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/yellow-books";

  useEffect(() => {
    if (error_param) {
      if (error_param === "insufficient_permissions") {
        setError("Admin эрх хүрэлцэхгүй байна. Admin нэвтрэхийг сонгоод dev орчинд ADMIN болгож болно.");
      } else {
        setError("Authentication failed. Please try again.");
      }
    }
  }, [error_param]);

  const handleGitHubSignIn = async () => {
    setLoading(true);
    try {
      await signIn("github", { callbackUrl, redirect: true });
    } catch {
      setError("Failed to sign in with GitHub");
      setLoading(false);
    }
  };

  const handleAdminSignIn = async () => {
    setLoading(true);
    try {
      await signIn("github", { callbackUrl: "/grant-admin", redirect: true });
    } catch {
      setError("Failed to sign in as admin");
      setLoading(false);
    }
  };

  const handleUserSignIn = async () => {
    setLoading(true);
    try {
      await signIn("github", { callbackUrl: "/yellow-books", redirect: true });
    } catch {
      setError("Failed to sign in as user");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">YellBook</h1>
          <p className="text-gray-400">Нэвтрэх төрөлөө сонгоно уу</p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleAdminSignIn}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center"
            >
              {loading ? "Signing in..." : "Admin нэвтрэх"}
            </button>

            <button
              onClick={handleUserSignIn}
              disabled={loading}
              className="w-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center"
            >
              {loading ? "Signing in..." : "User нэвтрэх"}
            </button>

            <button
              onClick={handleGitHubSignIn}
              disabled={loading}
              className="w-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center space-x-3 border border-gray-700"
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin">⏳</span>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>GitHub-ээр нэвтрэх</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-700/50 rounded text-gray-300 text-sm">
            <p className="mb-2 font-semibold">Тайлбар</p>
            <p>
              Admin нэвтрэх нь dev орчинд таны хэрэглэгчийг ADMIN болгоод /admin руу оруулна.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm space-y-2">
          <p>
            <Link href="/" className="text-blue-400 hover:text-blue-300">
              Back to Home
            </Link>
          </p>
          <p>
            <Link href="/privacy" className="hover:text-gray-300">
              Privacy Policy
            </Link>
            {" • "}
            <Link href="/terms" className="hover:text-gray-300">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
