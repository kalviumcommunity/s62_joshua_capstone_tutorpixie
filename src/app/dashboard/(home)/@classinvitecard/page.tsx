"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ClassesTab from "@/components/ClassesTab";

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

const fetchInvites = async (): Promise<ClassInvite[]> => {
  const res = await axios.get<ApiResponse>('/api/classes/invites');
  if (!res.data.success) {
    throw new Error(res.data.message || "Failed to fetch invites");
  }
  return res.data.data;
};

const ClassInvites: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery<ClassInvite[], Error>({
    queryKey: ["class-invites"],
    queryFn: fetchInvites,
  });

  if (isLoading) {
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg m-4 w-full">
        <h2 className="text-xl font-bold mb-4">Class Invites</h2>
        <div className="text-center py-8">Loading invites...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg m-4 w-full">
        <h2 className="text-xl font-bold mb-4">Class Invites</h2>
        <div className="text-center py-8 text-red-400">{error.message}</div>
      </div>
    );
  }

  return (
    <ClassesTab
      name="Class Invites"
      type="pending"
      apiData={data}
    />
  );
};

export default ClassInvites;
