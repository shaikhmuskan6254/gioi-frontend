// students.jsx
import Image from 'next/image';

const Students = () => {
  return (
    <div className="bg-blue-500 py-12 px-6 sm:px-8 lg:px-16 text-center text-white">
      {/* Title and Subtitle */}
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
          Learners
        </h2>
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4">
          Engaging <span className="text-black">Worldwide</span>
        </h3>
      </div>

      {/* Description */}
      <div className="mb-8 max-w-4xl mx-auto">
        <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed">
          The <span className="font-bold">Global Innovator Olympiad (GIO)</span> showcases excellence, bringing together outstanding learners from more than 10 nations, uniting brilliance globally. <br />
          <span className="text-white font-extrabold">
            India, Saudi Arabia, UAE, South Africa, Norway, Nepal, USA, Qatar, and Kuwait.
          </span>
        </p>
      </div>

      {/* Image */}
      <div className="flex justify-center">
        <Image
          src="/student1.jpg" // Replace with the actual path to your image
          alt="Student smiling"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default Students;
