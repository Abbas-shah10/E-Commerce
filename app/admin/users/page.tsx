import { getUsers } from "@/app/actions/users";
import UserActionsMenu from "@/components/layout/UserActionsMenu";
import Link from "next/link";
import React from "react";

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

const formatDateTime = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const UsersPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const currentSearch = params.search?.trim() || "";
  const requestedPage = Number.parseInt(params.page || "1", 10);
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const {
    users,
    totalPages,
    currentPage: fetchedPage,
  } = await getUsers({
    search: currentSearch,
    page: currentPage,
    limit: 10,
  });

  const safeTotalPages = Math.max(1, totalPages);
  const safeFetchedPage = Math.min(
    Math.max(1, fetchedPage || currentPage),
    safeTotalPages,
  );
  const pageHref = (page: number) => {
    const query = new URLSearchParams();
    if (currentSearch) query.set("search", currentSearch);
    query.set("page", String(page));
    return `/admin/users?${query.toString()}`;
  };
  const firstItem = users.length === 0 ? 0 : (safeFetchedPage - 1) * 10 + 1;
  const lastItem = (safeFetchedPage - 1) * 10 + users.length;

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
            ["Total pages", String(safeTotalPages), "bg-white"],
            ["Current page", String(safeFetchedPage), "bg-white"],
            ["Users on page", String(users.length), "bg-white"],
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
            <form method="get" className="relative w-full sm:max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                ⌕
              </span>
              <input
                name="search"
                type="search"
                defaultValue={currentSearch}
                placeholder="Search users..."
                className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-gray-400"
              />
              <input type="hidden" name="page" value="1" />
            </form>
            {currentSearch && (
              <Link
                href="/admin/users?page=1"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear
              </Link>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3 text-start">User</th>
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
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-start text-gray-900">
                            {user.username}
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
                          user.role === "admin"
                            ? "bg-green-50 text-green-700"
                            : user.role === "user"
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDateTime(user.createdAt)}
                    </td>
                    <td className="absolute px-6 py-4 text-right">
                      <UserActionsMenu userId={user._id} />
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 text-sm text-gray-500">
            <span>
              {users.length === 0
                ? "Showing 0 users"
                : `Showing ${firstItem}–${lastItem} on page ${safeFetchedPage}`}
            </span>
            <div className="flex gap-2">
              {safeFetchedPage > 1 ? (
                <Link
                  href={pageHref(safeFetchedPage - 1)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50"
                >
                  Previous
                </Link>
              ) : (
                <span className="cursor-not-allowed rounded-lg border border-gray-200 px-3 py-1.5 text-gray-300">
                  Previous
                </span>
              )}
              {safeFetchedPage < safeTotalPages ? (
                <Link
                  href={pageHref(safeFetchedPage + 1)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50"
                >
                  Next
                </Link>
              ) : (
                <span className="cursor-not-allowed rounded-lg border border-gray-200 px-3 py-1.5 text-gray-300">
                  Next
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
