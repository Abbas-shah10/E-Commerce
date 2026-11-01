import { Suspense } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { requireAdmin } from "@/lib/guards";
import { adminLinks } from "@/lib/nav";

async function AdminContent({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <DashboardShell links={adminLinks} title="Admin" user={user}>
      {children}
    </DashboardShell>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <AdminContent>{children}</AdminContent>
    </Suspense>
  );
}
