import React from 'react';

const DemoSession = () => {
  return (
    <div className="bg-[#DCE4FC] py-12 flex flex-col items-center text-center px-4">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Demo Session</h2>
      <div className="w-full max-w-3xl">
        <div className="relative w-full pb-[56.25%]"> {/* Aspect ratio 16:9 */}
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            width="560"
            height="315"
            src="https://www.youtube.com/embed/fvBDtu4LIlA?si=GkgsulfWaxjii1v5"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default DemoSession;