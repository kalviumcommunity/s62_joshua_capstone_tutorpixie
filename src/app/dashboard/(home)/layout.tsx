export default function HomeDashLayout({
  children,
  statcard,
  sessionform,
  upcomingclasses,
  classinvitecard
}: Readonly<{
  children: React.ReactNode;
  statcard: React.ReactNode;
  sessionform: React.ReactNode;
  upcomingclasses: React.ReactNode;
  classinvitecard: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col h-full bg-gray-100 overflow-hidden">
      <div className="flex-shrink-0 px-4">
        {children}
        {statcard}
      </div>
      
      <div className="flex flex-row justify-between gap-4 px-4 overflow-y-auto flex-1">
        <div className="flex-1">{sessionform}</div>
        <div className="flex-1">{upcomingclasses}</div>
        <div className="flex-1">{classinvitecard}</div>
      </div>
    </main>
  );
}