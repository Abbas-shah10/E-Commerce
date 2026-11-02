import { getUsers } from "@/app/actions/users";
import React from "react";

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const currentSearch = params.search?.trim() || "";
  const requestedPage = Number.parseInt(params.page || "1", 10);
  const currentPage = String(
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1,
  );

  const {
    users,
    totalPages,
    currentPage: fetchedPage,
  } = await getUsers({
    search: currentSearch,
    page: parseInt(currentPage),
    limit: 10,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your team members and their account permissions.
            </p>
          </div>
          <button className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800">
            + Add user
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            ["Total users", String(totalPages), "bg-white"],
            ["Active users", totalPages, "bg-white"],
            ["Pending invites", String(totalPages), "bg-white"],
          ].map(([label, value, style]) => (
            <div
              key={String(label)}
              className={`${style} rounded-xl border border-gray-200 p-5`}
            >
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <p className="mt-2 text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                ⌕
              </span>
              <input
                type="text"
                placeholder="Search users..."
                className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-gray-400"
              />
            </div>
            <button className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Joined</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${user.color}`}
                        >
                          {user.initials}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.role}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-green-50 text-green-700"
                            : user.status === "Pending"
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{user.joined}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="rounded-md px-2 py-1 text-lg font-bold text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                        •••
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 text-sm text-gray-500">
            <span>Showing 1–5 of 248 users</span>
            <div className="flex gap-2">
              <button className="rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50">
                Previous
              </button>
              <button className="rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
