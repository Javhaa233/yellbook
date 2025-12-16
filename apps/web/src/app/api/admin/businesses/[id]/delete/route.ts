import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/server-auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  await requireAdminSession();
  const { id } = await context.params;

  await prisma.yellowBookEntry.delete({ where: { id } });

  return NextResponse.redirect(new URL("/admin/businesses", request.url), 303);
}
