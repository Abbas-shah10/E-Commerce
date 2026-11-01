import { Suspense } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { requireUser } from "@/lib/guards";
import { userLinks } from "@/lib/nav";

async function UserContent({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <DashboardShell links={userLinks} title="My Account" user={user}>
      {children}
    </DashboardShell>
  );
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <UserContent>{children}</UserContent>
    </Suspense>
  );
}
