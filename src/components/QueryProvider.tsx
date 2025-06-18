"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react";

interface props {
    children: React.ReactNode
}

export default function QueryProvider({children}: props){
    const [queryClient] = useState(()=> new QueryClient());
    
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}