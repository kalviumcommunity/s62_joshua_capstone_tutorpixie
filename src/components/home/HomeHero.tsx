import React from 'react';
import Image from 'next/image';

const Hero = () => {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-8">
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl">
        <div className="text-center lg:text-left max-w-2xl">
          <h1 className="text-5xl font-bold text-black mb-6 leading-tight">
            We Make Online Tutoring <br /> <span className="text-black">Delightful !</span>
          </h1>
          <p className="text-gray-700 text-xl mb-6">
            Personalised online sessions with expert tutors.
          </p>
          <button className="bg-black text-white px-8 py-3 text-lg rounded-lg hover:bg-gray-800 transition">
            Try a Free Demo!
          </button>
        </div>
        <div className="relative w-110 h-110 mt-8 lg:mt-0">
          <div className="absolute inset-0 bg-highlightblue rounded-full"></div>
          <Image src="/heroimg.webp" alt="Online Tutoring" width={500} height={500} className="relative rounded-lg object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
