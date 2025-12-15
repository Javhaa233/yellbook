import { requireAuthSession } from '@/lib/server-auth';

export default async function YellowBooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthSession();
  return <>{children}</>;
}
