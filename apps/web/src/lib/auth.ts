import { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      allowDangerousEmailAccountLinking: true,
      // Enable Device Flow for CLI/headless authentication
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({ user }: any) {
      // Find or create user
      if (user?.email) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (prisma as any).user.upsert({
          where: { email: user.email },
          update: {
            name: user.name || undefined,
            image: user.image || undefined,
          },
          create: {
            email: user.email,
            name: user.name || undefined,
            image: user.image || undefined,
            role: "USER",
          },
        });
      }
      return true;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      // On initial sign-in, link token to DB user.
      if (user?.email) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dbUser = await (prisma as any).user.findUnique({
          where: { email: user.email },
          select: { id: true, role: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
        return token;
      }

      // For subsequent requests, refresh role from DB so role updates take effect
      // without forcing a new sign-in.
      if (token?.id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dbUser = await (prisma as any).user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        });
        if (dbUser?.role) {
          token.role = dbUser.role;
        }
      }

      return token;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).id = token.id as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login?error=auth_failed",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
