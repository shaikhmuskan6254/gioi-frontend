"use client";
import Image from "next/image";
// import { FaPlay } from "react-icons/fa";

const Hero = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-200 py-12 px-6 sm:px-8 lg:px-10 xl:px-16 flex flex-col md:flex-row items-center justify-center">
      {/* Left Section: Text Content */}
      <div className="md:w-1/2 w-full text-center md:text-left mb-10 md:mb-0">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-black">
          The Prestigious <br />
          Online Olympiad
          <br />
          Exams From
          <br />
          <span className="text-blue-600">Class V to X</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl lg:text-2xl text-gray-700">
          The Global Innovator Olympiad (GIO), organized by{" "}
          <a href="https://www.isrc.org.in" target="_blank" rel="noopener noreferrer"><strong>ISRC</strong></a>, is an international competition where students
          apply creativity and problem-solving skills to real-world challenges.
        </p>

        {/* "What is GIO" Heading */}
        {/* <div className="mt-8">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4">
            Registration Video
          </h3> */}

        {/* YouTube Video Button with Icon in a Rectangle Box */}
        {/* <a
            href="https://youtu.be/YjJn99qnWoM" // Replace with your YouTube link
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-800 transition-transform duration-300 ease-in-out transform hover:scale-105 rounded-md px-8 py-4 text-white text-lg font-semibold shadow-lg"
          >
            <FaPlay className="text-2xl mr-3 animate-pulse" />
            Tune In
          </a>
        </div> */}
      </div>

      {/* Right Section: Image */}
      <div className="relative md:w-1/2 w-full flex items-center justify-center">
        {/* Image Container */}
        <div className="relative w-64 sm:w-80 md:w-96 lg:w-[600px] xl:w-[750px]">
          <Image
            src="/hero.png" // Replace with your image path
            alt="Smiling student"
            width={750} // Set the original image width for high resolution
            height={900} // Set the original height to maintain aspect ratio
            layout="responsive"
            className="rounded-lg object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
