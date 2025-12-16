import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdminSession } from "@/lib/server-auth";
import { prisma } from "@/lib/prisma";
import { OrganizationKind } from "@prisma/client";

export default async function AdminEditBusinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;

  const [categories, entry] = await Promise.all([
    prisma.yellowBookCategory.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.yellowBookEntry.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        shortName: true,
        summary: true,
        description: true,
        streetAddress: true,
        district: true,
        province: true,
        website: true,
        email: true,
        phone: true,
        secondaryPhone: true,
        facebook: true,
        instagram: true,
        googleMapUrl: true,
        hours: true,
        latitude: true,
        longitude: true,
        kind: true,
        categoryId: true,
      },
    }),
  ]);

  if (!entry) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Edit Business</h1>
          <p className="text-gray-400 mt-1">ID: {entry.id}</p>
        </div>
        <Link
          href="/admin/businesses"
          className="px-4 py-2 rounded border border-gray-600 text-gray-200 hover:bg-gray-800"
        >
          Back
        </Link>
      </div>

      <form
        action={`/api/admin/businesses/${entry.id}`}
        method="POST"
        className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Name *</div>
            <input
              name="name"
              required
              defaultValue={entry.name}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Short name</div>
            <input
              name="shortName"
              defaultValue={entry.shortName ?? ""}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
        </div>

        <label className="space-y-1 block">
          <div className="text-sm text-gray-300">Summary *</div>
          <textarea
            name="summary"
            required
            rows={3}
            defaultValue={entry.summary}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
          />
        </label>

        <label className="space-y-1 block">
          <div className="text-sm text-gray-300">Description</div>
          <textarea
            name="description"
            rows={5}
            defaultValue={entry.description ?? ""}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
          />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Street address *</div>
            <input
              name="streetAddress"
              required
              defaultValue={entry.streetAddress}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
          <label className="space-y-1">
            <div className="text-sm text-gray-300">District *</div>
            <input
              name="district"
              required
              defaultValue={entry.district}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Province *</div>
            <input
              name="province"
              required
              defaultValue={entry.province}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Phone *</div>
            <input
              name="phone"
              required
              defaultValue={entry.phone}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Secondary phone</div>
            <input
              name="secondaryPhone"
              defaultValue={entry.secondaryPhone ?? ""}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Email</div>
            <input
              name="email"
              type="email"
              defaultValue={entry.email ?? ""}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Website</div>
            <input
              name="website"
              type="url"
              defaultValue={entry.website ?? ""}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Google Map URL</div>
            <input
              name="googleMapUrl"
              type="url"
              defaultValue={entry.googleMapUrl ?? ""}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Category *</div>
            <select
              name="categoryId"
              required
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
              defaultValue={entry.categoryId}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Kind *</div>
            <select
              name="kind"
              required
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
              defaultValue={entry.kind}
            >
              {Object.values(OrganizationKind).map((kind) => (
                <option key={kind} value={kind}>
                  {kind}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Hours</div>
            <input
              name="hours"
              defaultValue={entry.hours ?? ""}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Facebook</div>
            <input
              name="facebook"
              type="url"
              defaultValue={entry.facebook ?? ""}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Instagram</div>
            <input
              name="instagram"
              type="url"
              defaultValue={entry.instagram ?? ""}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Latitude</div>
            <input
              name="latitude"
              inputMode="decimal"
              defaultValue={entry.latitude == null ? "" : String(entry.latitude)}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Longitude</div>
            <input
              name="longitude"
              inputMode="decimal"
              defaultValue={entry.longitude == null ? "" : String(entry.longitude)}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <form action={`/api/admin/businesses/${entry.id}/delete`} method="POST">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded font-semibold"
            >
              Delete
            </button>
          </form>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/businesses"
              className="px-4 py-2 rounded border border-gray-600 text-gray-200 hover:bg-gray-800"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded font-semibold"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
