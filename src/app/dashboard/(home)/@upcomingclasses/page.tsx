"use client";
import ClassesTab from "@/components/ClassesTab";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// Type definitions for the API response
interface ClassInvite {
  id: number;
  subject: string;
  tutorId: number;
  studentId: number;
  startTime: string;
  duration: number;
  meetlink: string | null;
  tutorApprov: boolean;
  studentApprov: boolean;
  repeating: boolean;
  repeatingDay: number;
  status: string;
}

interface ApiResponse {
  message: string;
  success: boolean;
  data: ClassInvite[];
}

// API function
const fetchApprovedClasses = async (): Promise<ClassInvite[]> => {
  const res = await axios.get<ApiResponse>('/api/classes/approved');
  
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "Failed to fetch classes data");
  }
  
  return res.data.data;
};

const UpcomingClasses: React.FC = () => {
  const {
    data: apiData = [],
    isLoading: loading,
    error,
    isError
  } = useQuery({
    queryKey: ['classes-approved'],
    queryFn: fetchApprovedClasses,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2, // Retry failed requests 2 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  if (loading) {
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg m-4 w-full">
        <h2 className="text-xl font-bold mb-4">Upcoming Classes</h2>
        <div className="text-center py-8">Loading classes...</div>
      </div>
    );
  }

  if (isError) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Failed to fetch classes";
      
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg m-4 w-full">
        <h2 className="text-xl font-bold mb-4">Upcoming Classes</h2>
        <div className="text-center py-8 text-red-400">{errorMessage}</div>
      </div>
    );
  }

  return (
    <ClassesTab 
      name="Upcoming Classes"
      type="confirmed"
      apiData={apiData}
    />
  );
};

export default UpcomingClasses;