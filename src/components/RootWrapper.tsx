"use client"; 

import { SessionProvider } from "next-auth/react";

export default function RootWrapper({ children }:{children: React.ReactNode}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
