import React from 'react';
import { CheckCircle, XCircle } from "lucide-react";

type ClassCardProps = {
  subject: string;
  time: string;
  date: string;
  type: string;
};

const ClassCard: React.FC<ClassCardProps> = ({ subject, time, date, type }) => {
  return (
    <div className="flex justify-between items-center bg-gray-200 rounded-lg p-2 shadow-sm mx-2">
        <div>
            <p className="font-bold text-lg text-black">{subject}</p>
        </div>
        <div>
            <p className="text-sm text-gray-600">{time}</p>
            <p className="text-sm text-gray-600">{date}</p>
        </div>
      {
        type === "confirmed" ?(
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Join</button>
        ):(
            <div className="flex space-x-4 px-4 py-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500">
              <CheckCircle className="w-4 h-4 text-white" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500">
              <XCircle className="w-4 h-4 text-white" />
            </button>
          </div>
        )
      }
    </div>
  );
};

export default ClassCard;