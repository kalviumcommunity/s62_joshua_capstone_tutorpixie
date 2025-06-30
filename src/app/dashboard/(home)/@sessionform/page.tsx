"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const fetchStudents = async () => {
  const res = await axios.get("/api/user/student");
  return res.data.data;
};

const fetchTutors = async (sid: number) => {
  const res = await axios.get(`/api/user/relation/student/${sid}`);
  return res.data.data;
};

const postSession = async (sessionData) => {
  const res = await axios.post("/api/classes", sessionData);
  return res.data;
};

const SessionForm = () => {
  const [sessionType, setSessionType] = useState("repeating");
  const [selectedDay, setSelectedDay] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [timezone, setTimezone] = useState("IST");
  const [duration, setDuration] = useState("");
  const [subject, setSubject] = useState("");
  const [studentId, setStudentId] = useState<number>();
  const [tutorId, setTutorId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
    enabled: session?.user?.role === "Admin",
  });

  const {
    data: tutors = [],
    refetch: refetchTutors,
  } = useQuery({
    queryKey: ["tutors", studentId],
    queryFn: () => fetchTutors(studentId!),
    enabled: !!studentId,
  });

  const mutation = useMutation({
    mutationFn: postSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-invites"] });
      resetForm();
    },
    onError: () => {
      setErrorMessage("An error occurred while submitting your session request.");
    },
  });

  useEffect(() => {
    if (session?.user?.role === "Student") {
      setStudentId(session.user.id);
    }
  }, [session?.user?.role]);

  const toggleSessionType = (type) => setSessionType(type);

  const studentChange = (e) => {
    const sid = parseInt(e.target.value);
    setStudentId(sid);
    setTutorId("");
    setSubject("");
  };

  const handleSubjectChange = (e) => {
    const id = e.target.value;
    const subject = e.target.selectedOptions[0].getAttribute("data-subject");
    setTutorId(id);
    setSubject(subject);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!tutorId || !studentId || !startTime || !duration || !timezone) {
      setErrorMessage("Please fill out all required fields");
      return;
    }

    if (sessionType === "repeating" && selectedDay === "") {
      setErrorMessage("Please select a day for repeating sessions");
      return;
    }

    if (sessionType === "one-time" && !date) {
      setErrorMessage("Please select a date for one-time session");
      return;
    }

    try {
      const today = new Date();
      let startDateTime;

      if (sessionType === "one-time") {
        startDateTime = new Date(`${date}T${startTime}:00`);
      } else {
        const currentDayOfWeek = today.getDay();
        let daysToAdd = 7;
        for (let i = 1; i <= 7; i++) {
          const checkDay = (currentDayOfWeek + i) % 7;
          if (checkDay === selectedDay) {
            daysToAdd = i;
            break;
          }
        }
        const nextClassDate = new Date(today);
        nextClassDate.setDate(today.getDate() + daysToAdd);
        const formattedDate = nextClassDate.toISOString().split("T")[0];
        startDateTime = new Date(`${formattedDate}T${startTime}:00`);
      }

      if (timezone === "PST") {
        startDateTime.setHours(startDateTime.getHours() + 13);
        startDateTime.setMinutes(startDateTime.getMinutes() + 30);
      } else if (timezone === "GMT") {
        startDateTime.setHours(startDateTime.getHours() + 5);
        startDateTime.setMinutes(startDateTime.getMinutes() + 30);
      }

      const endDateTime = new Date(startDateTime.getTime());
      const durationInMinutes = parseFloat(duration) * 60;
      endDateTime.setMinutes(endDateTime.getMinutes() + durationInMinutes);

      if (isNaN(endDateTime.getTime())) {
        setErrorMessage("Error calculating end time. Please check your inputs.");
        return;
      }

      const sessionData = {
        subject,
        tutorId: parseInt(tutorId),
        studentId: studentId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        duration: parseFloat(duration),
        meetlink: null,
        repeating: sessionType === "repeating",
        repeatingDay: sessionType === "repeating" ? selectedDay : null,
        status: "Pending",
      };

      mutation.mutate(sessionData);
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong while submitting the session.");
    }
  };

  const resetForm = () => {
    setSessionType("repeating");
    setSelectedDay("");
    setDate("");
    setStartTime("");
    setTimezone("IST");
    setDuration("");
    setSubject("");
    setErrorMessage("");
    if (session?.user?.role !== "Student") {
      setStudentId(undefined);
    }
    setTutorId("");
  };


  const dayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="bg-gray-900 text-white p-5 my-4 min-w-max rounded-2xl w-100">
      <h2 className="text-lg h-5 font-semibold text-center">Request a Session</h2>

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

      {/* Day Dropdown (Only for Repeating Sessions) */}
      {sessionType === "repeating" && (
        <select
          className="mt-4 w-full p-2 bg-white text-gray-800 rounded-lg"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value === "" ? "" : parseInt(e.target.value))}
        >
          <option value="" disabled>Select Day</option>
          {dayLabels.map((dayLabel, index) => (
            <option key={index} value={index}>
              {dayLabel}
            </option>
          ))}
        </select>
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
            <option value="0.5">30 mins</option>
            <option value="0.75">45 mins</option>
            <option value="1">1 hour</option>
            <option value="1.5">1.5 hours</option>
            <option value="2">2 hours</option>
        </select>

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