import Image from 'next/image';

const AboutGO = () => {
  return (
    <div className="flex flex-col md:flex-row items-center px-6 py-12 bg-white">
      {/* Left Section: Title and Image */}
      <div className="md:w-1/2 w-full text-center md:text-left flex flex-col items-center md:items-start mb-8 md:mb-0 md:ml-2">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 text-black xl:ml-20 ">
        Innovation <span className="text-blue-600">Spotlight</span>
        </h2>

        {/* Image positioned below the title */}
        <div className="flex justify-center md:justify-start lg:ml-32">
          <Image
            src="/homeabout.png" // Replace with the actual path to your image
            alt="Person smiling"
            width={450}
            height={550}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Right Section: Description aligned with the image */}
      <div className="md:w-1/2 w-full px-4 text-gray-700 flex flex-col justify-center items-center md:items-start">
        <p className="text-lg sm:text-xl lg:text-4xl leading-relaxed text-center md:text-left">
        
Top performers gain global recognition, with the top 50 schools featured in major publications. Join GIO to inspire innovation and showcase your school’s excellence.
        </p>
      </div>
    </div>
  );
};

export default AboutGO;
