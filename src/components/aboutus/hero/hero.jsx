import Image from "next/image";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter(); // use useRouter hook to get router object

  const handleRoute = () => {
    router.push("/gio-profile"); // navigate to '/gio-profile'
  };
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between bg-blue-500 text-white p-8 lg:p-16">
      {/* Left Section: Text Content */}
      <div className="lg:w-1/2 text-center lg:text-left">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
          Whats <span className="text-black">GIO?</span>
        </h1>
        <ul className="text-lg sm:text-xl md:text-2xl lg:text-3xl space-y-4 sm:space-y-6 mb-8">
          <li>Extensive Preparation Resources</li>
          <li>Proven Reach and Participation</li>
          <li>Global Presence</li>
        </ul>
        <button
          onClick={handleRoute}
          className="px-8 sm:px-10 py-3 sm:py-4 bg-green-500 text-white font-semibold text-lg sm:text-xl rounded-full hover:bg-black transition duration-300"
        >
          Register Now
        </button>
      </div>

      {/* Right Section: Image with Additional Elements */}
      <div className="lg:w-1/2 relative mt-8 lg:mt-0 flex justify-center lg:justify-end">
        <Image
          src="/GIOLOGO.png" // Replace with your actual image path
          alt="About GIO"
          width={450}
          height={500}
          className="rounded-lg object-contain"
        />
      </div>
    </section>
  );
};

export default Hero;
