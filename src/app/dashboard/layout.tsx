import Sidebar from "./Sidebar";

export default function DashLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-grow bg-gray-100 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
