import DashboardShell from "@/components/layout/DashboardShell";
import { requireUser } from "@/lib/guards";
import { userLinks } from "@/lib/nav";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const dashboardLinks = userLinks.map((link) => ({
    ...link,
    icon: () => null,
  }));

  return (
    <DashboardShell links={dashboardLinks} title="My Account" user={user}>
      {children}
    </DashboardShell>
  );
}
