"use client";

import ClassesTab from "@/components/ClassesTab";
import axios from "axios";
import { useEffect, useState } from "react";

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

// Type for transformed class data
interface TransformedClass {
  subject: string;
  time: string;
  date: string;
}

const ClassInvites: React.FC = () => {
  const [classList, setClassList] = useState<TransformedClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to format date and time
  const formatDateTime = (startTime: string, duration: number) => {
    const date = new Date(startTime);
    
    // Format time (e.g., "9pm (1 hr)")
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      hour12: true
    };
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
    const time = `${formattedTime} (${duration} hr${duration > 1 ? 's' : ''})`;
    
    // Format date (e.g., "Wed 4th Jun")
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    
    // Add ordinal suffix (st, nd, rd, th)
    const getOrdinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    const formattedDate = `${dayName} ${day}${getOrdinalSuffix(day)} ${month}`;
    
    return { time, date: formattedDate };
  };

  // Transform API data to component format
  const transformClassData = (apiData: ClassInvite[]): TransformedClass[] => {
    return apiData.map(classItem => {
      const { time, date } = formatDateTime(classItem.startTime, classItem.duration);
      
      return {
        subject: classItem.subject.charAt(0).toUpperCase() + classItem.subject.slice(1), // Capitalize first letter
        time,
        date
      };
    });
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await axios.get<ApiResponse>('/api/classes/invites');
        console.log("res", res.data);
        
        if (res.data && res.data.success && res.data.data) {
          const transformedData = transformClassData(res.data.data);
          console.log("Transformed data:", transformedData);
          setClassList(transformedData);
        } else {
          console.log("Response structure issue:", res.data);
          setError("Invalid response structure");
        }
      } catch (err: any) {
        console.error("Failed to fetch classes:", err);
        
        // More specific error messages
        if (err.response) {
          setError(`API Error: ${err.response.status} - ${err.response.data?.message || err.message}`);
        } else if (err.request) {
          setError("Network Error: No response from server");
        } else {
          setError(`Request Error: ${err.message}`);
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
        <h2 className="text-xl font-bold mb-4">Class Invites</h2>
        <div className="text-center py-8">Loading invites...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg m-4 w-full">
        <h2 className="text-xl font-bold mb-4">Class Invites</h2>
        <div className="text-center py-8 text-red-400">{error}</div>
      </div>
    );
  }

  // For class invites, we want to show the pending type since they need approval
  const getClassType = () => {
    return "pending"; // This will show the accept/reject buttons
  };

  return (
    <ClassesTab 
      name="Class Invites" 
      type={getClassType()}
      classList={classList}
    />
  );
};

export default ClassInvites;