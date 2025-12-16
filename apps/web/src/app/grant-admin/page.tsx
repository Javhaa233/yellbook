import { redirect } from "next/navigation";

import { requireAuthSession } from "@/lib/server-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GrantAdminPage() {
  const session = await requireAuthSession();

  // Never allow this in production.
  if (process.env.NODE_ENV === "production") {
    redirect("/login?callbackUrl=/admin&error=insufficient_permissions");
  }

  const userId = (session.user as { id?: string } | undefined)?.id;
  if (!userId) {
    redirect("/login?callbackUrl=/admin&error=auth_failed");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: "ADMIN" },
  });

  redirect("/admin");
}
