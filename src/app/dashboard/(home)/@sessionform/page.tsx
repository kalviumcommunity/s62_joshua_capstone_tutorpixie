"use client";

import { useState } from "react";

const SessionForm = () => {
  const [sessionType, setSessionType] = useState("repeating");
  const [selectedDays, setSelectedDays] = useState([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");

  const toggleSessionType = (type) => setSessionType(type);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="bg-gray-900 text-white p-5 my-4 rounded-2xl w-100">
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

      {/* Subject Dropdown */}
      <select className="mt-4 w-full p-2 bg-white text-gray-800 rounded-lg">
        <option disabled>Subject</option>
        <option>Math</option>
        <option>Physics</option>
        <option>Chemistry</option>
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
      <select className="w-1/2 p-2 bg-white text-gray-800 rounded-lg">
        <option disabled>Time Zone</option>
        <option>GMT</option>
        <option>PST</option>
        <option>IST</option>
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
            {["MO", "TU", "WE", "TH", "FR", "SA", "SU"].map((day, index) => (
              <button
                key={index}
                className={`w-8 h-8 rounded-full text-sm ${
                  selectedDays.includes(day)
                    ? "bg-purple-500 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
                onClick={() => toggleDay(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button className="mt-6 w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg">
        Request Session
      </button>
    </div>
  );
};

export default SessionForm;
