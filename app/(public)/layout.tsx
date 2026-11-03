import Navbar from "@/components/layout/layout/Navbar";
import Footer from "@/components/layout/layout/Layout";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
