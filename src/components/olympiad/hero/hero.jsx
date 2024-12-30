import Image from 'next/image';

const Hero = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between p-8 md:p-16 bg-white">
      {/* Left Section: Text Content */}
      <div className="md:w-1/2 text-center md:text-left">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black leading-tight mb-6">
          The Global Innovator <br />
          Olympiad <span className="text-blue-600">(GIO)</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 leading-relaxed mt-6">
          India’s first AI-powered Olympiad, offering students worldwide a chance to compete in English, Mathematics, Science, Social Science, and Mental Ability.
        </p>
      </div>

      {/* Right Section: Image */}
      <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
        <Image
          src="/hero.png" // Replace with the actual path to your image
          alt="Student reading a book"
          width={500} // Increased image size
          height={600} // Increased image size
          className="rounded-lg shadow-md object-contain"
        />
      </div>
    </section>
  );
};

export default Hero;
