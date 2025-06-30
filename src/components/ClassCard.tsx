'use client'

import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import ReviewBtn from "./ReviewBtn";
import { useSession } from "next-auth/react";

type ClassCardProps = {
  id: number;
  subject: string;
  time: string;
  date: string;
  type: string;
  duration: number;
};

const ClassCard = ({ id, subject, time, date, type, duration }: ClassCardProps) => {

  const {data: session} = useSession();
  
  if (!session?.user) {
    console.log("No session or user found");
  }

  async function acceptInvite() {
    try {
      await axios.put(`/api/classes/invites/approve/${id}`);
      console.log("invite accepted");
    } catch (error) {
      console.log("Error in accepting invite")
    }
  }
  
  async function rejectInvite(){
    try {
      await axios.put(`/api/classes/invites/reject/${id}`);
      console.log("invite rejected");
    } catch (error) {
      console.log("Error in rejecting invite", error)
    }
  }

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
        type === "confirmed" ? (
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Join</button>
        ) : (type==="review")?(
          <ReviewBtn id={id} duration={duration} />
        ):(
          <div className="flex space-x-4 px-4 py-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500" onClick={acceptInvite}>
              <CheckCircle className="w-4 h-4 text-white" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500" onClick={rejectInvite}>
              <XCircle className="w-4 h-4 text-white" />
            </button>
          </div>
        )
      }
    </div>
  );
};

export default ClassCard;
