import React from "react";
import ClassCard from "./ClassCard";

const ClassesTab: React.FC<{name: string, type: string}> = ({name, type='confirmed'}) => {
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg min-w-120 my-4 max-w-md">
      <h2 className="text-xl font-bold mb-4">{name}</h2>
      <div className="space-y-4 max-h-90 overflow-auto">
        <ClassCard subject="Math" time="9-10pm" date="Sat 3rd Feb" type={type} />
        <ClassCard subject="Physics" time="9-10pm" date="Sat 3rd Feb" type={type} />
        <ClassCard subject="Physics" time="9-10pm" date="Sat 3rd Feb" type={type} />
        <ClassCard subject="Physics" time="9-10pm" date="Sat 3rd Feb" type={type} />
        <ClassCard subject="Physics" time="9-10pm" date="Sat 3rd Feb" type={type} />
        <ClassCard subject="Physics" time="9-10pm" date="Sat 3rd Feb" type={type} />
        <ClassCard subject="Physics" time="9-10pm" date="Sat 3rd Feb" type={type} />
        <ClassCard subject="Physics" time="9-10pm" date="Sat 3rd Feb" type={type} />
        <ClassCard subject="Physics" time="9-10pm" date="Sat 3rd Feb" type={type} />
      </div>
    </div>
  );
};

export default ClassesTab;