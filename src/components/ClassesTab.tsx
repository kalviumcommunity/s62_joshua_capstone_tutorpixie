"use client";
import React, { useEffect, useState } from "react";
import ClassCard from "./ClassCard";

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

interface TransformedClass {
  id: number;
  subject: string;
  time: string;
  date: string;
  duration: string;
}

const ClassesTab: React.FC<{name: string, type?: string, apiData?: ClassInvite[]}> = ({name, type='confirmed', apiData = []}) => {
  
  const [classList, setClassList] = useState<TransformedClass[]>([]);
  
  // Function to format date and time
  const formatDateTime = (startTime: string, duration: number) => {
        
    const date = new Date(startTime);
    // Format time (e.g., "10:30 AM", "9:15 PM (1 hr)")
    const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
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
  const transformClassData = (apiData: ClassInvite[]) => {
    setClassList(apiData.map(classItem => {
      const { time, date } = formatDateTime(classItem.startTime, classItem.duration);
            
      return {
        id: classItem.id,
        subject: classItem.subject.charAt(0).toUpperCase() + classItem.subject.slice(1), // Capitalize first letter
        time,
        date,
        duration: classItem.duration
      };
    }));
  };
  
  useEffect(() => {
    transformClassData(apiData);
  }, [apiData]);
  
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg m-4 w-full">
      <h2 className="text-xl font-bold mb-4">{name}</h2>
      <div className="space-y-4 max-h-90 overflow-auto">
        {
            classList.map((item, index) => (
                <ClassCard key={index} id={item.id} subject={item.subject} time={item.time} date={item.date} type={type} duration={item.duration} />
            ))
        }
      </div>
    </div>
  );
};

export default ClassesTab;