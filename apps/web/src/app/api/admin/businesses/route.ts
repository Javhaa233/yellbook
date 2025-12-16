import { NextResponse } from "next/server";
import { OrganizationKind } from "@prisma/client";

import { requireAdminSession } from "@/lib/server-auth";
import { prisma } from "@/lib/prisma";

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(formData: FormData, key: string): string | null {
  const value = getString(formData, key);
  return value.length ? value : null;
}

function getOptionalFloat(formData: FormData, key: string): number | null {
  const raw = getString(formData, key);
  if (!raw) return null;
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function POST(request: Request) {
  await requireAdminSession();

  const formData = await request.formData();

  const name = getString(formData, "name");
  const shortName = getOptionalString(formData, "shortName");
  const summary = getString(formData, "summary");
  const description = getOptionalString(formData, "description");
  const streetAddress = getString(formData, "streetAddress");
  const district = getString(formData, "district");
  const province = getString(formData, "province");
  const website = getOptionalString(formData, "website");
  const email = getOptionalString(formData, "email");
  const phone = getString(formData, "phone");
  const secondaryPhone = getOptionalString(formData, "secondaryPhone");
  const facebook = getOptionalString(formData, "facebook");
  const instagram = getOptionalString(formData, "instagram");
  const googleMapUrl = getOptionalString(formData, "googleMapUrl");
  const hours = getOptionalString(formData, "hours");
  const latitude = getOptionalFloat(formData, "latitude");
  const longitude = getOptionalFloat(formData, "longitude");
  const categoryId = getString(formData, "categoryId");
  const kindRaw = getString(formData, "kind");

  const kindValues = Object.values(OrganizationKind) as string[];
  if (!kindValues.includes(kindRaw)) {
    return new NextResponse("Invalid kind", { status: 400 });
  }

  if (!name || !summary || !streetAddress || !district || !province || !phone || !categoryId) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  await prisma.yellowBookEntry.create({
    data: {
      name,
      shortName,
      summary,
      description,
      streetAddress,
      district,
      province,
      website,
      email,
      phone,
      secondaryPhone,
      facebook,
      instagram,
      googleMapUrl,
      hours,
      latitude,
      longitude,
      kind: kindRaw as OrganizationKind,
      categoryId,
    },
  });

  return NextResponse.redirect(new URL("/admin/businesses", request.url), 303);
}
