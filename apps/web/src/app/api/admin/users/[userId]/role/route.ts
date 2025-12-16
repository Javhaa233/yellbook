import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const allowedRoles = new Set(["USER", "ADMIN"] as const);

type AllowedRole = "USER" | "ADMIN";

export async function POST(
  request: Request,
  context: { params: Promise<{ userId: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.redirect(new URL("/login?callbackUrl=/admin/users", request.url));
  }

  const currentRole = (session.user as { role?: string } | undefined)?.role;
  const currentUserId = (session.user as { id?: string } | undefined)?.id;

  if (currentRole !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden", message: "Admin role required" },
      { status: 403 },
    );
  }

  const { userId } = await context.params;
  const formData = await request.formData();
  const role = formData.get("role");

  if (typeof role !== "string" || !allowedRoles.has(role as AllowedRole)) {
    return NextResponse.json(
      { error: "BadRequest", message: "Invalid role" },
      { status: 400 },
    );
  }

  if (currentUserId && userId === currentUserId && role === "USER") {
    return NextResponse.json(
      { error: "BadRequest", message: "Cannot demote yourself" },
      { status: 400 },
    );
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: role as AllowedRole },
      select: { id: true },
    });
  } catch {
    return NextResponse.json(
      { error: "NotFound", message: "User not found" },
      { status: 404 },
    );
  }

  return NextResponse.redirect(new URL("/admin/users", request.url));
}
