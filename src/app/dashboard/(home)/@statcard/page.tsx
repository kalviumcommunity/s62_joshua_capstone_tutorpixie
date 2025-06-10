import React from "react";

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl shadow-md p-1 flex-1 min-h-16 flex flex-col justify-around items-center">
    <h3 className="font-semibold text-2xl text-gray-900">{title}</h3>
    <div className="mt-1">{children}</div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="bg-gray-900 p-4 rounded-2xl flex gap-16 justify-center items-stretch">
      <Card title="Total Hours">
        <p className="text-3xl font-bold text-gray-900">59</p>
        <p className="text-sm text-gray-500 mt-1">Next: Tue, 4 PM</p>
      </Card>

      <Card title="Assignments">
        <div className="flex gap-2 flex-wrap justify-center">
          <span className="bg-blue-300 text-blue-900 px-3 py-1 rounded-full text-md">Math</span>
          <span className="bg-blue-300 text-blue-900 px-3 py-1 rounded-full text-md">Physics</span>
        </div>
      </Card>

      <Card title="Billing">
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700">
          Pay Dues
        </button>
      </Card>
    </div>
  );
};

export default Dashboard;
