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
    <main className="flex-grow bg-gray-100 overflow-y-auto p-3">
    {children}
    {statcard}
    <div className="display flex flex-row justify-between">
      {sessionform}
      {upcomingclasses}
      {classinvitecard}
    </div>
    </main>
  );
}
