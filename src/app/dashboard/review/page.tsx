"use client";
import ClassesTab from "@/components/ClassesTab";
import axios from "axios";
import { useEffect, useState } from "react";

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


const ReviewSession: React.FC = () => {
  const [apiData, setApiData] = useState<ClassInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const res = await axios.get<ApiResponse>('/api/classes/reviewing');
        console.log("res", res.data);
        
        if (res.data.success && res.data.data) {
          setApiData(res.data.data);
        } else {
          setError("Failed to fetch classes data");
        }
      } catch (err: any) {
        console.log("Failed to fetch classes:", err);
        if (err.response) {
          setError(`API Error: ${err.response.status} - ${err.response.data?.message || err.message}`);
        } else if (err.request) {
          setError("Network Error: No response from server");
        } else {
          setError(`Failed to fetch classes`);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg m-4 w-full">
        <h2 className="text-xl font-bold mb-4">Review Classes</h2>
        <div className="text-center py-8">Loading classes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg m-4 w-full">
        <h2 className="text-xl font-bold mb-4">Review Classes</h2>
        <div className="text-center py-8 text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full">
        <div className="flex p-4 flex-1">
            <ClassesTab 
            name="Review Sessions" 
            type="review"
            apiData={apiData}
            />
        </div>
    </div>
  );
};

export default ReviewSession;