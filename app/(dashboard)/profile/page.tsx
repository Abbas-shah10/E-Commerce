import { auth } from "@/lib/auth";
import Link from "next/link";

const Profile = async () => {
  const session = await auth();
  const name = session?.user?.name || "Alex Morgan";
  const email = session?.user?.email || "alex.morgan@example.com";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-[#f6f7fb] px-4 py-8 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="relative h-44 overflow-hidden bg-linear-to-br from-violet-600 via-indigo-600 to-sky-400 sm:h-52">
            <div className="absolute -left-16 -top-24 h-64 w-64 rounded-full border-36 border-white/10" />
            <div className="absolute right-10 top-8 h-24 w-24 rounded-full bg-white/10 blur-sm" />
            <div className="absolute -bottom-17.5 -right-20px h-52 w-52 rounded-full border-28 border-white/10" />
          </div>

          <div className="relative px-6 pb-7 sm:px-8">
            <div className="flex flex-col items-start sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-start sm:flex-row sm:items-end">
                {session?.user?.image ? (
                  <span>{session?.user.name?.charAt(0).toUpperCase()}</span>
                ) : (
                  <div className="-mt-14 flex h-28 w-28 items-center justify-center rounded-3xl border-[6px] border-white bg-linear-to-br from-slate-900 to-indigo-700 text-3xl font-bold text-white shadow-xl sm:-mt-16 sm:h-32 sm:w-32">
                    {initials}
                  </div>
                )}

                <div className="mt-4 sm:mb-1 sm:ml-5">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      {name}
                    </h1>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white">
                      ✓
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Product Designer · San Francisco, CA
                  </p>
                </div>
              </div>

              <Link
                href={`/profile/${name}`}
                className="mt-5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700 sm:mt-0"
              >
                Edit profile
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Profile;
