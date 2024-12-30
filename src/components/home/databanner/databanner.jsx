"use client";
import { useEffect, useState } from "react";

const Databanner = () => {
  const [stats, setStats] = useState({
    countries: 0,
    students: 0,
    schools: 0,
    tests: 0,
  });

  useEffect(() => {
    let countInterval;
    const animateNumbers = () => {
      const duration = 2000; // Animation duration in milliseconds
      const increment = (endValue) => endValue / (duration / 100);

      let currentCountries = 0;
      let currentSchools = 0;
      let currentStudents = 0;
      let currentTests = 0;

      countInterval = setInterval(() => {
        currentCountries += increment(10);
        currentSchools += increment(3887);
        currentStudents += increment(517343);
        currentTests += increment(4010231);

        if (currentCountries >= 10) currentCountries = 10;
        if (currentSchools >= 3887) currentSchools = 3887;
        if (currentStudents >= 517343) currentStudents = 517343;
        if (currentTests >= 4010231) currentTests = 4010231;

        setStats({
          countries: Math.floor(currentCountries),
          schools: Math.floor(currentSchools),
          students: Math.floor(currentStudents),
          tests: Math.floor(currentTests),
        });

        if (
          currentCountries === 10 &&
          currentSchools === 3887 &&
          currentStudents === 517343 &&
          currentTests === 4010231
        ) {
          clearInterval(countInterval);
        }
      }, 100);
    };

    animateNumbers();
    return () => clearInterval(countInterval);
  }, []);

  const formatNumber = (number) => {
    return number.toLocaleString("en-IN");
  };

  return (
    <section className="bg-blue-500 mt-0 py-12 relative">
      <div className="container mx-auto flex flex-col md:flex-row justify-around items-center">
        {/* Countries */}
        <div className="text-center mb-6 md:mb-0">
          <h3 className="text-4xl md:text-5xl font-bold font-montserrat text-white">
            {stats.countries}+
          </h3>
          <p className="text-xl md:text-2xl font-lato text-white mt-2">
            Nations
          </p>
        </div>

        {/* Schools Collaborated */}
        <div className="text-center mb-6 md:mb-0">
          <h3 className="text-4xl md:text-5xl font-bold font-lato text-white">
            {formatNumber(stats.schools)}+
          </h3>
          <p className="text-xl md:text-2xl font-lato text-white mt-2">
            Schools Have Collaborated
          </p>
        </div>

        {/* Last Year Participants */}
        <div className="text-center mb-6 md:mb-0">
          <h3 className="text-4xl md:text-5xl font-bold font-lato text-white">
            {formatNumber(stats.students)}+
          </h3>
          <p className="text-xl md:text-2xl font-lato text-white mt-2">
            Students Joined The Adventure Last Year
          </p>
        </div>

        {/* Total Students Impacted */}
        <div className="text-center">
          <h3 className="text-4xl md:text-5xl font-bold font-montserrat text-white">
            {formatNumber(stats.tests)}+
          </h3>
          <p className="text-xl md:text-2xl font-montserrat text-white mt-2">
            Total Students Impacted
          </p>
        </div>
      </div>
    </section>
  );
};

export default Databanner;
