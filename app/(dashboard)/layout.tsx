import DashboardShell from "@/components/layout/DashboardShell";
import { requireUser } from "@/lib/guards";
import { userLinks } from "@/lib/nav";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <DashboardShell links={userLinks} title="My Account" user={user}>
      {children}
    </DashboardShell>
  );
}
