"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { convertFromUTC, convertToUTC, getNextRepeatingClassDate, supportedTimezones } from "@/lib/timezone";
import { toast } from "sonner";

const fetchStudents = async () => {
  const res = await axios.get("/api/user/student");
  console.log("fetched students");
  return res.data.data;
};

const fetchStudentRelations = async (tid: number) => {
  //returns the students and subjects for the given tutor id
  const res = await axios.get(`/api/user/relation/tutor/${tid}`);
  console.log("fetched student relations", res.data.data);
  return res.data.data;
}

const fetchTutors = async (sid: number) => {
  //returns the tutors and subject for the given student id
  const res = await axios.get(`/api/user/relation/student/${sid}`);
  console.log("fetched tutors")
  return res.data.data;
};

const postSession = async (sessionData: any) => {
  const res = await axios.post("/api/classes", sessionData);
  return res.data;
};

const SessionForm = () => {
  const [sessionType, setSessionType] = useState("one-time");
  const [selectedDay, setSelectedDay] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [timezone, setTimezone] = useState("IST");
  const [duration, setDuration] = useState("");
  const [subject, setSubject] = useState("");
  const [studentId, setStudentId] = useState();
  const [tutorId, setTutorId] = useState();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [selectedSubjectOption, setSelectedSubjectOption] = useState("");

  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
    enabled: session?.user?.role === "Admin",
  });

  const { data: studentRelations = [] } = useQuery({
    queryKey: ["student-relations"],
    queryFn: () => fetchStudentRelations(tutorId!),
    enabled: session?.user?.role === "Tutor" && tutorId !== undefined,
  });

  const { data: tutors = [] } = useQuery({
    queryKey: ["tutors", studentId],
    queryFn: () => fetchTutors(studentId!),
    enabled: (session?.user?.role === "Admin" || session?.user?.role == "Student") && studentId !== undefined,
  });

  const mutation = useMutation({
    mutationFn: postSession,
    onMutate: () => {
      toast.loading("Creating class invite...", { id: "post-class-invite" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-invites"] });

      toast.success("Class invite created successfully!", {
        id: "post-class-invite",
        style: { color: "green" },
      });

      resetForm();
    },
    onError: () => {
      toast.error("An error occurred while submitting your session request.");

      toast.error("Failed to create class invite.", {
        id: "post-class-invite",
        style: { color: "red" },
      });
    },
  });

  useEffect(() => {
    if (session?.user?.role === "Student") {
      setStudentId(session.user.id);
    } else if(session?.user?.role === "Tutor") {
      setTutorId(session.user.id);
    }

    if (session?.user?.timezone) {
      setTimezone(session.user.timezone);
    }
  }, [session?.user?.role, session?.user?.timezone]);

  const toggleSessionType = (type) => setSessionType(type);

  const studentChange = (e) => {
    const sid = parseInt(e.target.value);
    setStudentId(sid);
    setTutorId(null);
    setSubject("");
  };

const handleSubjectChange = (e) => {
  const selectedValue = e.target.value; // This will be the composite key
  const selectedOption = e.target.selectedOptions[0];
  const id = selectedOption.getAttribute("data-id");
  const subject = selectedOption.getAttribute("data-subject");
  
  if(session?.user?.role === "Tutor") {
    setStudentId(parseInt(id));
  } else {
    console.log("Setting tutor ID:", id);
    setTutorId(parseInt(id));
  }
  setSubject(subject);
  setSelectedSubjectOption(selectedValue);
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!tutorId || !studentId || !startTime || !duration || !timezone) {
    toast.error("Please fill out all required fields");
    return;
  }

  if (sessionType === "repeating" && selectedDay === "") {
    toast.error("Please select a day for repeating sessions");
    return;
  }

  if (sessionType === "one-time" && !date) {
    toast.error("Please select a date for one-time session");
    return;
  }

  try {
    let utcDate: Date;

    if (sessionType === "one-time") {
      const localDateTime = `${date}T${startTime}:00`;
      utcDate = convertToUTC(localDateTime, timezone);
      console.log("UTC ISO:", utcDate.toISOString());
      const backToLocal = convertFromUTC(utcDate.toISOString(), timezone);
      // console.log(`Back to ${timezone}: `, DateTime.fromJSDate(backToLocal).setZone(timezone).toFormat("yyyy-MM-dd'T'HH:mm:ss"));
      console.log(`Back to ${timezone}: `, backToLocal);
    } else {
      utcDate = getNextRepeatingClassDate(selectedDay as number, startTime, timezone);
      console.log("UTC ISO:", utcDate.toISOString());
      // const backToLocal = convertFromUTC(utcDate.toISOString(), timezone);
      // console.log(`Back to ${timezone}: `, DateTime.fromJSDate(backToLocal).setZone(timezone).toFormat("yyyy-MM-dd'T'HH:mm:ss"));
    }
    const endDateTime = new Date(utcDate.getTime());
    const durationInMinutes = parseFloat(duration) * 60;
    endDateTime.setMinutes(endDateTime.getMinutes() + durationInMinutes);

    if (isNaN(endDateTime.getTime())) {
      toast.error("Error calculating end time. Please check your inputs.");
      return;
    }

    const sessionData = {
      subject,
      tutorId: parseInt(tutorId),
      studentId: parseInt(studentId),
      startTime: utcDate.toISOString(),
      endTime: endDateTime.toISOString(),
      duration: parseFloat(duration),
      meetlink: null,
      repeating: sessionType === "repeating",
      repeatingDay: sessionType === "repeating" ? selectedDay : null,
      status: "Pending",
    };

    mutation.mutate(sessionData);
  } catch (error) {
    toast.error("Something went wrong while submitting the session.");
  }
};

  const resetForm = () => {
    setSessionType("one-time");
    setSelectedDay("");
    setDate("");
    setStartTime("");
    setTimezone(session?.user?.timezone || "Asia/Kolkata");
    setDuration("");
    setSubject("");
    setSelectedSubjectOption(""); // Add this line
    toast.error("");
    if (session?.user?.role !== "Student") {
      setStudentId(undefined);
    }
    if(session?.user?.role !== "Tutor"){
      setTutorId(undefined);
    }
  };


  const dayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="bg-gray-900 text-white p-5 rounded-2xl w-100">
      <h2 className="text-lg h-5 font-semibold text-center">Request a Session</h2>

      {/* Toggle Buttons */}
      <div className="flex mt-4 bg-gray-700 rounded-lg p-1">
        <button
          className={`flex-1 py-2 rounded-lg ${
            sessionType === "one-time" ? "bg-blue-400 text-white" : "text-gray-300"
          }`}
          onClick={() => toggleSessionType("one-time")}
        >
          One Time
        </button>
        <button
          className={`flex-1 py-2 rounded-lg ${
            sessionType === "repeating" ? "bg-blue-400 text-white" : "text-gray-300"
          }`}
          onClick={() => toggleSessionType("repeating")}
        >
          Repeating
        </button>
      </div>

      {
        (session?.user?.role=='Admin' && (students.length>0))&&(
          <div>
              <select className="mt-4 w-full p-2 bg-white text-gray-800 rounded-lg border-x-4 border-transparent" value={studentId || ""} onChange={studentChange}>
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
      <select 
        className="mt-4 w-full p-2 bg-white text-gray-800 rounded-lg border-x-4 border-transparent" 
        value={selectedSubjectOption} 
        onChange={handleSubjectChange}
      >
        <option disabled value="">Select Subject</option>
        {(session?.user?.role != "Tutor") ?
          tutors.map((tutor, index) => {
            const optionValue = `tutor-${tutor.tutor.id}-${tutor.subject}-${index}`;
            return (
              <option 
                key={optionValue} 
                value={optionValue} 
                data-id={tutor.tutor.id}
                data-subject={tutor.subject}
              >
                {tutor.tutor.name} - {tutor.subject}
              </option>
            );
          })
          :
          studentRelations.map((relation, index) => {
            const optionValue = `student-${relation.studentId}-${relation.subject}-${index}`;
            return (
              <option 
                key={optionValue} 
                value={optionValue} 
                data-id={relation.studentId}
                data-subject={relation.subject}
              >
                {relation.student.name} - {relation.subject}
              </option>
            );
          })
        }
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
          className="mt-4 w-full p-2 bg-white text-gray-800 rounded-lg border-x-4 border-transparent"
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
          className="w-1/2 p-2 bg-white text-gray-800 rounded-lg border-x-4 border-transparent"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          disabled={!!session?.user?.timezone}
        >
          <option value="" disabled>
            Select Time Zone
          </option>
          {supportedTimezones.map(tz => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </div>
      
      <select
          className="mt-4 w-full p-2 bg-white text-gray-800 rounded-lg border-x-4 border-transparent"
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

      {/* Submit Button */}
      <button className="mt-3 w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg" onClick={handleSubmit}>
        Request Session
      </button>
    </div>
  );
};

export default SessionForm;