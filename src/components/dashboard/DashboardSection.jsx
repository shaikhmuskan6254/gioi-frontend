import { IoMdCheckmark, IoMdPeople, IoMdStar } from "react-icons/io";

const DashboardSection = ({ userData, students, practiceTestCounts }) => {
  return (
    <section className="DashboardHero w-full h-[85%] flex flex-col gap-5 py-5 bg-white">
      {/* School Profile */}
      <div className="w-full shadow-lg p-5 bg-gradient-to-r from-white to-[#2563EB] rounded-lg">
        <div className="w-full px-5">
          <span className="text-sm md:text-[1.2vw] font-bold px-8 py-2 rounded-2xl text-white bg-[#2563EB]">
            School Profile
          </span>
        </div>
        <div className="text-center w-full mt-5">
          <h1 className="text-xl md:text-[2.5vw] font-bold text-[#2563EB]">
            Welcome 👋, {userData?.principalName || "PrincipalName"}
          </h1>
          <p className="uppercase text-[#2563EB] text-lg md:text-[1.5vw] mt-5 font-bold">
            {userData?.schoolName || "Your School Name"}
          </p>
        </div>
      </div>

      {/* Learning Board */}
      <div className="w-full md:w-[80%] bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] mx-auto rounded-2xl p-5 text-white">
        <h1 className="text-lg md:text-[1.2vw] font-semibold">
          Learning Board
        </h1>
        <div className="w-full flex flex-col md:flex-row justify-between gap-4 p-5">
          {/* Total Students */}
          <div className="flex flex-col w-full md:w-[30%] bg-gradient-to-r from-[#3B82F6] to-[#2563EB] shadow-lg rounded-2xl p-5 text-center transition-transform transform hover:scale-105">
            <h1 className="text-lg md:text-[1.2vw] font-semibold text-white flex items-center justify-center">
              <IoMdPeople className="mr-2 text-2xl" /> Total Students
            </h1>
            <span className="py-5 font-bold text-3xl text-white">
              {students?.length || 0}
            </span>
          </div>
          {/* Practice Test Completed */}
          <div className="flex flex-col w-full md:w-[30%] bg-gradient-to-r from-[#34D399] to-[#10B981] shadow-lg rounded-2xl p-5 text-center transition-transform transform hover:scale-105">
            <h1 className="text-lg md:text-[1.2vw] font-semibold text-white flex items-center justify-center">
              <IoMdCheckmark className="mr-2 text-2xl" /> Practice Test Completed
            </h1>
            <span className="py-5 font-bold text-3xl text-white">
              {practiceTestCounts?.totalPracticeTests || 0}
            </span>
          </div>
          {/* Final Test Completed */}
          <div className="flex flex-col w-full md:w-[30%] bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] shadow-lg rounded-2xl p-5 text-center transition-transform transform hover:scale-105">
            <h1 className="text-lg md:text-[1.2vw] font-semibold text-white flex items-center justify-center">
              <IoMdStar className="mr-2 text-2xl" /> Final Test Completed
            </h1>
            <span className="py-5 font-bold text-3xl text-white">
              {practiceTestCounts?.finalPracticeTests || 0}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
