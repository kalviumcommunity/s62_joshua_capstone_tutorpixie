const testimonials = [
  { id: 1, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", author: "Parent", location: "Australia" },
  { id: 2, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", author: "Parent", location: "USA" },
  { id: 3, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", author: "Parent", location: "UK" },
  { id: 4, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", author: "Parent", location: "USA" },
];

const Testimonials = () => {

  return (
    <div className="bg-black py-10 w-full flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className={`bg-white rounded-lg p-6 shadow-md text-center transition-all duration-300`}
          >
            <div className="text-3xl">&quot;</div>
            <p className="text-gray-700 text-md mt-4">{testimonial.text}</p>
            <p className="font-bold mt-4">{testimonial.author}</p>
            <p className="text-gray-500">{testimonial.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;