import Sidebar from "./Sidebar";

export default function DashLayout({
  children,
  statcard
}: Readonly<{
  children: React.ReactNode;
  statcard: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-grow bg-gray-100 overflow-y-auto p-3">
        {children}
        {statcard}
      </main>
    </div>
  );
}
