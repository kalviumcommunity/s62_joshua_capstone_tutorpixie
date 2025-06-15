import React from 'react';
import Image from 'next/image';
import { FaCalculator, FaFlask, FaDna, FaAtom, FaBook, FaInfinity } from 'react-icons/fa';

const subjects = [
  { name: 'Math', icon: <FaCalculator />, color: 'bg-purple-200', textColor: 'text-purple-800' },
  { name: 'Physics', icon: <FaAtom />, color: 'bg-green-200', textColor: 'text-green-800' },
  { name: 'Chemistry', icon: <FaFlask />, color: 'bg-blue-200', textColor: 'text-blue-800' },
  { name: 'Biology', icon: <FaDna />, color: 'bg-red-200', textColor: 'text-red-800' },
  { name: 'SAT', icon: <FaBook />, color: 'bg-gray-200', textColor: 'text-gray-800' },
  { name: 'Vedic Math', icon: <FaInfinity />, color: 'bg-yellow-200', textColor: 'text-yellow-800' }
];

const steps = [
  { title: 'Registration', icon: '/icons/registration.png' },
  { title: 'Understanding Requirements', icon: '/icons/understanding.png' },
  { title: 'Demo Session', icon: '/icons/demo.png' },
  { title: 'Session Commences', icon: '/icons/session.png' }
];

const OfferApproach = () => {
  return (
    <section className="py-16 bg-white text-center">
      {/* What We Offer */}
      <h2 className="text-3xl font-bold mb-8">What We Offer</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {subjects.map((subject, index) => (
          <div key={index} className={`flex items-center p-4 rounded-lg shadow-md ${subject.color}`}>
            <span className={`text-3xl ${subject.textColor} mr-3`}>{subject.icon}</span>
            <p className={`text-lg cursor-default font-semibold ${subject.textColor}`}>{subject.name}</p>
          </div>
        ))}
      </div>

      <button className="mt-8 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
        Try a Free Demo!
      </button>

      {/* Our Approach */}
      <div className="mt-16 bg-indigo-100 py-12 px-12 rounded-lg max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Our Approach</h2>
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <Image src={step.icon} alt={step.title} width={80} height={80} className="mb-3" />
              <p className="text-lg font-medium text-gray-700">{step.title}</p>
              <div className="hidden md:block w-16 h-1 bg-gray-400 mt-3" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferApproach;
