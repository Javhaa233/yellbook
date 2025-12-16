import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  console.log("🌱 Seeding admin users...");

  try {
    // List of admin emails - add your GitHub email here
    const adminEmails = [
      "admin@yellbook.com",
      // Add your GitHub account email here to become admin
      "javhaa233@gmail.com", // Example: your GitHub email
    ];

    for (const email of adminEmails) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const admin = await (prisma as any).user.upsert({
        where: { email },
        update: {
          role: "ADMIN",
        },
        create: {
          email,
          name: email.split("@")[0],
          role: "ADMIN",
        },
      });
      console.log("✅ Admin user seeded:", admin.email, "with role:", admin.role);
    }

    console.log("\n🎉 All admin users seeded successfully!");
    console.log("📝 Note: When you sign in with GitHub using one of these emails, you'll have admin access.");
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
