// booknow.jsx
import Image from 'next/image';

const BookNow = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center bg-white p-8 md:p-12 shadow-lg">
      {/* Blue Container with Text and Image */}
      <div className="md:w-4/5 bg-blue-500 text-white p-10 rounded-lg flex flex-col md:flex-row items-center md:items-start">
        
        {/* Left Section: Text Content */}
        <div className="md:w-3/5 text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-black">
            Let's Connect - <br />
            <span className="text-white">We're Here to Help You</span>
          </h2>
          {/* Chat Now Button */}
          <a
            href="https://wa.me/919594402916" // WhatsApp link with number
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block px-8 py-3 bg-green-500 text-white font-semibold text-lg rounded-full shadow-lg hover:bg-black hover:text-white transition duration-300 ease-in-out transform hover:scale-105"
          >
            Chat Now
          </a>
        </div>

   
        <div className="md:w-2/5 flex justify-center md:justify-end mt-6 md:mt-0">
          <div className="relative w-64 h-48">
            <Image
              src="/booknow.png" 
              alt="Smiling person"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
            
   
            <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 rounded-full shadow-md text-sm font-semibold">
              Let's Chat
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookNow;
