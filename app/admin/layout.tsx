import DashboardShell from "@/components/layout/DashboardShell";
import { requireAdmin } from "@/lib/guards";
import { adminLinks } from "@/lib/nav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  return (
    <DashboardShell links={adminLinks} title="Admin" user={user}>
      {children}
    </DashboardShell>
  );
}
