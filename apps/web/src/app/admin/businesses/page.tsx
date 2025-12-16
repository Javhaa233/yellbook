import Link from "next/link";

import { requireAdminSession } from "@/lib/server-auth";
import { prisma } from "@/lib/prisma";

export default async function AdminBusinessesPage() {
  await requireAdminSession();

  const entries = await prisma.yellowBookEntry.findMany({
    orderBy: { updatedAt: "desc" },
    take: 50,
    select: {
      id: true,
      name: true,
      kind: true,
      district: true,
      province: true,
      phone: true,
      updatedAt: true,
      category: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Businesses</h1>
          <p className="text-gray-400 mt-1">YellowBookEntry CRUD (сүүлийн 50 бичлэг).</p>
        </div>

        <Link
          href="/admin/businesses/new"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-semibold"
        >
          + New Business
        </Link>
      </div>

      <div className="overflow-x-auto bg-gray-800 border border-gray-700 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-900/40 text-gray-300">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Category</th>
              <th className="text-left px-4 py-3 font-medium">Kind</th>
              <th className="text-left px-4 py-3 font-medium">Location</th>
              <th className="text-left px-4 py-3 font-medium">Phone</th>
              <th className="text-left px-4 py-3 font-medium">Updated</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-900/30">
                <td className="px-4 py-3 text-white max-w-[340px]">
                  <div className="font-semibold line-clamp-1">{entry.name}</div>
                  <div className="text-xs text-gray-400">{entry.id}</div>
                </td>
                <td className="px-4 py-3 text-gray-200">
                  {entry.category?.name ?? "-"}
                </td>
                <td className="px-4 py-3 text-gray-200">{entry.kind}</td>
                <td className="px-4 py-3 text-gray-300">
                  {entry.district}, {entry.province}
                </td>
                <td className="px-4 py-3 text-gray-200">{entry.phone}</td>
                <td className="px-4 py-3 text-gray-300">
                  {new Date(entry.updatedAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/businesses/${entry.id}/edit`}
                      className="px-3 py-1.5 rounded border border-gray-600 text-gray-200 hover:bg-gray-700"
                    >
                      Edit
                    </Link>
                    <form
                      action={`/api/admin/businesses/${entry.id}/delete`}
                      method="POST"
                    >
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
