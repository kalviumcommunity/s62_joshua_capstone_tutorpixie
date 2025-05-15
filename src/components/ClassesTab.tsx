import React from "react";
import ClassCard from "./ClassCard";

const ClassesTab: React.FC<{name: string, type?: string, classList?: {subject: string, time: string, date: string}[]}> = ({name, type='confirmed', classList= [{subject: "Physics", time: "9-10pm", date: "Sat 3rd Feb", type: "confirmed"},
    {subject: "Math", time: "9-10pm", date: "Sat 3rd Feb", type: "confirmed"},
    {subject: "English", time: "9-10pm", date: "Sat 3rd Feb", type: "confirmed"}]}) => {

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg m-4 w-full">
      <h2 className="text-xl font-bold mb-4">{name}</h2>
      <div className="space-y-4 max-h-90 overflow-auto">
        {
            classList.map((item, index) => (
                <ClassCard key={index} subject={item.subject} time={item.time} date={item.date} type={type} />
            ))
        }
      </div>
    </div>
  );
};

export default ClassesTab;