import Link from "next/link";

import { requireAdminSession } from "@/lib/server-auth";
import { prisma } from "@/lib/prisma";
import { OrganizationKind } from "@prisma/client";

export default async function AdminNewBusinessPage() {
  await requireAdminSession();

  const categories = await prisma.yellowBookCategory.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">New Business</h1>
          <p className="text-gray-400 mt-1">Шинэ байгууллага нэмнэ.</p>
        </div>
        <Link
          href="/admin/businesses"
          className="px-4 py-2 rounded border border-gray-600 text-gray-200 hover:bg-gray-800"
        >
          Back
        </Link>
      </div>

      <form
        action="/api/admin/businesses"
        method="POST"
        className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Name *</div>
            <input
              name="name"
              required
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>

          <label className="space-y-1">
            <div className="text-sm text-gray-300">Short name</div>
            <input
              name="shortName"
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
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
          />
        </label>

        <label className="space-y-1 block">
          <div className="text-sm text-gray-300">Description</div>
          <textarea
            name="description"
            rows={5}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
          />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Street address *</div>
            <input
              name="streetAddress"
              required
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
          <label className="space-y-1">
            <div className="text-sm text-gray-300">District *</div>
            <input
              name="district"
              required
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Province *</div>
            <input
              name="province"
              required
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
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Secondary phone</div>
            <input
              name="secondaryPhone"
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Email</div>
            <input
              name="email"
              type="email"
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
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Google Map URL</div>
            <input
              name="googleMapUrl"
              type="url"
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
              defaultValue={categories[0]?.id ?? ""}
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
              defaultValue={OrganizationKind.BUSINESS}
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
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Instagram</div>
            <input
              name="instagram"
              type="url"
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
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
          <label className="space-y-1">
            <div className="text-sm text-gray-300">Longitude</div>
            <input
              name="longitude"
              inputMode="decimal"
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
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
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
