import { requireAdminSession } from "@/lib/server-auth";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const session = await requireAdminSession();
  const currentUserId = (session.user as { id?: string } | undefined)?.id;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-gray-400 mt-1">Admin эрхээр хэрэглэгчийн role-ийг өөрчилнө.</p>
      </div>

      <div className="overflow-x-auto bg-gray-800 border border-gray-700 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-900/40 text-gray-300">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Role</th>
              <th className="text-left px-4 py-3 font-medium">Created</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users.map((user) => {
              const isSelf = Boolean(currentUserId && user.id === currentUserId);
              const isAdmin = user.role === "ADMIN";

              return (
                <tr key={user.id} className="hover:bg-gray-900/30">
                  <td className="px-4 py-3 text-white">
                    {user.name || <span className="text-gray-400">(no name)</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-200">
                    {user.email || <span className="text-gray-400">(no email)</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        isAdmin
                          ? "inline-flex items-center rounded-full bg-blue-600/20 text-blue-200 border border-blue-600/40 px-2 py-0.5"
                          : "inline-flex items-center rounded-full bg-gray-700 text-gray-200 border border-gray-600 px-2 py-0.5"
                      }
                    >
                      {user.role}
                    </span>
                    {isSelf && (
                      <span className="ml-2 text-xs text-gray-400">(you)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <form
                        action={`/api/admin/users/${user.id}/role`}
                        method="POST"
                      >
                        <input type="hidden" name="role" value="USER" />
                        <button
                          type="submit"
                          disabled={user.role === "USER" || isSelf}
                          className="px-3 py-1.5 rounded border border-gray-600 text-gray-200 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={isSelf ? "Өөрийн role-ийг USER болгохыг хориглоно" : "USER болгох"}
                        >
                          Set USER
                        </button>
                      </form>

                      <form
                        action={`/api/admin/users/${user.id}/role`}
                        method="POST"
                      >
                        <input type="hidden" name="role" value="ADMIN" />
                        <button
                          type="submit"
                          disabled={user.role === "ADMIN"}
                          className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Set ADMIN
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
