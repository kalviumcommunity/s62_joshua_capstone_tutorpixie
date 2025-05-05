"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const SessionForm = () => {
  const [sessionType, setSessionType] = useState("repeating");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [timezone, setTimezone] = useState("IST");
  const [duration, setDuration] = useState("");
  const [subject, setSubject] = useState("");
  const [studentId, setStudentId] = useState<number>();
  const [tutorId, setTutorId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {data: session} = useSession();

  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);

  const fetchStudents = async () =>{
    const res = await axios.get("/api/user/student");
    setStudents(res.data.data);
    console.log(res);
  }

  const fetchTutors = async (sid:number) =>{
    const res = await axios.get(`/api/user/relation/student/${sid}`);
    setTutors(res.data.data);
  }

  useEffect(()=>{
    if(session?.user?.role=="Admin"){
      fetchStudents();
    }else  if(session?.user?.role=="Student"){
      setStudentId(session?.user?.id);
      fetchTutors(session?.user?.id);
    }
  }, [session?.user?.role])

  const toggleSessionType = (type) => setSessionType(type);

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const studentChange = async (e) =>{
    const sid = parseInt(e.target.value);
    setStudentId(sid)
    setTutorId("");
    setSubject("");
    fetchTutors(sid);
  }

  const handleSubjectChange = async (e) =>{
    const id = e.target.value;
    const subject = e.target.selectedOptions[0].getAttribute("data-subject");
    setTutorId(id);
    setSubject(subject);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate inputs
    if (!tutorId || !studentId || !startTime || !duration || !timezone) {
      setErrorMessage("Please fill out all required fields");
      return;
    }

    if (sessionType === "repeating" && selectedDays.length === 0) {
      setErrorMessage("Please select at least one day for repeating sessions");
      return;
    }

    if (sessionType === "one-time" && !date) {
      setErrorMessage("Please select a date for one-time session");
      return;
    }

    try {
      // Get the current date for processing
      const today = new Date();
      let startDateTime;
      
      if (sessionType === "one-time") {
        // For one-time sessions, use the selected date
        startDateTime = new Date(`${date}T${startTime}:00`);
      } else {
        // For repeating sessions, find the next occurrence based on selectedDays
        
        // Get the current day of the week (0-6)
        const currentDayOfWeek = today.getDay();
        
        // Find the next day of the week that's in the selected days
        let daysToAdd = 7; // Default to a week if nothing is found (shouldn't happen)
        
        for (let i = 1; i <= 7; i++) {
          // Calculate the day to check (wrapping around the week)
          const checkDay = (currentDayOfWeek + i) % 7;
          
          // If this day is in our selected days, use it
          if (selectedDays.includes(checkDay)) {
            daysToAdd = i;
            break;
          }
        }
        
        // Create a new date for the next class
        const nextClassDate = new Date(today);
        nextClassDate.setDate(today.getDate() + daysToAdd);
        
        // Format the date part in YYYY-MM-DD
        const formattedNextDate = nextClassDate.toISOString().split('T')[0];
        
        // Create the start date time with the next class date and selected time
        startDateTime = new Date(`${formattedNextDate}T${startTime}:00`);
      }
      
      // Adjust for timezone - specifically for IST (UTC+5:30)
      if (timezone === "IST") {
        // Convert from IST to UTC by subtracting 5 hours and 30 minutes
        startDateTime.setHours(startDateTime.getHours() - 5);
        startDateTime.setMinutes(startDateTime.getMinutes() - 30);
      } else if (timezone === "PST") {
        // Convert from PST to UTC by adding 8 hours (PST is UTC-8)
        startDateTime.setHours(startDateTime.getHours() + 8);
      }
      // GMT is already UTC, so no adjustment needed
      
      // Calculate end time based on duration (in minutes)
      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + parseInt(duration));
      
      const sessionData = {
        subject,
        tutorId: parseInt(tutorId),
        studentId: parseInt(studentId),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        meetlink: null, // This can be generated server-side or updated later
        repeating: sessionType === "repeating",
        repeatingDays: selectedDays,
        status: "Pending" // Using the default from schema
      };

      console.log("Submitting session data:", sessionData);
      
      // Send data to API endpoint
      const response = await axios.post("/api/classes", sessionData);
      
      if (response.status === 200 || response.status === 201) {
        setErrorMessage("");
        // Success message can be shown here
        resetForm();
      } else {
        setErrorMessage("Failed to submit session request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting session:", error);
      setErrorMessage("An error occurred while submitting your session request.");
    }
  };

  // Add a reset form function to clear inputs after successful submission
  const resetForm = () => {
    setSessionType("repeating");
    setSelectedDays([]);
    setDate("");
    setStartTime("");
    setTimezone("IST");
    setDuration("");
    setSubject("");
    setErrorMessage("");
    if (session?.user?.role !== "Student") {
      setStudentId(undefined);
      setTutorId("");
    } else {
      setTutorId("");
    }
  };

  return (
    <div className="bg-gray-900 text-white p-5 my-4 min-w-max rounded-2xl w-100">
      <h2 className="text-lg h-5 font-semibold text-center">Request a Session</h2>
      {
        (session?.user?.role=='Admin' && (students.length>0))&&(
          <div>
              <select className="mt-4 w-full p-2 bg-white text-gray-800 rounded-lg" value={studentId || ""} onChange={studentChange}>
                <option disabled value="">Select Student</option>
                {
                  students.map(student=>(
                    <option key={student.id} value={student.id}>{student.name} ({student.id})</option>
                  ))
                }
              </select>   
          </div>
        )
      }

      {/* Toggle Buttons */}
      <div className="flex mt-4 bg-gray-700 rounded-lg p-1">
        <button
          className={`flex-1 py-2 rounded-lg ${
            sessionType === "repeating" ? "bg-blue-400 text-white" : "text-gray-300"
          }`}
          onClick={() => toggleSessionType("repeating")}
        >
          Repeating
        </button>
        <button
          className={`flex-1 py-2 rounded-lg ${
            sessionType === "one-time" ? "bg-blue-400 text-white" : "text-gray-300"
          }`}
          onClick={() => toggleSessionType("one-time")}
        >
          One Time
        </button>
      </div>

      {/* Subject Dropdown */}
      <select className="mt-4 w-full p-2 bg-white text-gray-800 rounded-lg" value={tutorId || ""} onChange={handleSubjectChange}>
        <option disabled value="">Select Subject</option>
        {tutors.map(tutor=>(
          <option key={tutor.id} value={tutor.tutor.id} data-subject={tutor.subject}>{tutor.tutor.name} - {tutor.subject}</option>
        ))}
      </select>

      {/* Date Picker (Only for One-Time Sessions) */}
      {sessionType === "one-time" && (
        <input
          type="date"
          className="mt-4 w-full p-2 bg-white text-gray-800 rounded-lg"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      )}

      {/* Time & Duration */}
      <div className="flex gap-2 mt-4">
        <input
          type="time"
          className="w-1/2 p-2 bg-white text-gray-800 rounded-lg"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        {/* Time Zone */}
        <select
          className="w-1/2 p-2 bg-white text-gray-800 rounded-lg"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
        >
          <option value="" disabled>
            Select Time Zone
          </option>
          <option value="IST">IST</option>
          <option value="GMT">GMT</option>
          <option value="PST">PST</option>
        </select>

      </div>
        <select
            className="mt-4 w-full p-2 bg-white text-gray-800 rounded-lg"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
        >
            <option value="" disabled>Duration</option>
            <option value="30">30 mins</option>
            <option value="45">45 mins</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
        </select>

      {/* Repeating Days */}
      {sessionType === "repeating" && (
        <div className="mt-3">
          <p className="text-sm text-gray-300">Repeating Every:</p>
          <div className="flex justify-around gap-2 mt-1">
            {[0, 1, 2, 3, 4, 5, 6].map((day) => {
              const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
              return (
                <button
                  key={day}
                  className={`w-8 h-8 rounded-full text-sm ${
                    selectedDays.includes(day)
                      ? "bg-purple-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => toggleDay(day)}
                  type="button"
                >
                  {dayLabels[day]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Error Message Display */}
      {errorMessage && (
        <div className="mt-3 py-2 px-3 bg-red-500 text-white rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Submit Button */}
      <button className="mt-6 w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg" onClick={handleSubmit}>
        Request Session
      </button>
    </div>
  );
};

export default SessionForm;