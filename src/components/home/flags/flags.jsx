"use client"
// flags.jsx
import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";

const Flags = () => {
  const controls = useAnimation();
  const containerRef = useRef(null);

  const flagData = [
    { src: "/flags/India.jpg", alt: "Flag of India", name: "India" },
    { src: "/flags/Norway.jpg", alt: "Flag of Norway", name: "Norway" },
    { src: "/flags/South Africa.jpg", alt: "Flag of South Africa", name: "South Africa" },
    { src: "/flags/Kuwait.jpg", alt: "Flag of Kuwait", name: "Kuwait" },
    { src: "/flags/Saudi.jpg", alt: "Flag of Saudi Arabia", name: "Saudi Arabia" },
    { src: "/flags/Qutar.jpg", alt: "Flag of Qatar", name: "Qatar" },
    { src: "/flags/UAE.jpg", alt: "Flag of UAE", name: "UAE" },
    { src: "/flags/Nepal.jpg", alt: "Flag of Nepal", name: "Nepal" },
    { src: "/flags/USA.jpg", alt: "Flag of USA", name: "USA" },
  ];

  // Duplicate the flags to create a seamless loop
  const duplicatedFlags = [...flagData, ...flagData];

  useEffect(() => {
    const animateFlags = async () => {
      if (containerRef.current) {
        // Calculate the width of the first set of flags
        const totalWidth = containerRef.current.scrollWidth / 2;

        // Start the animation to move the flags from right to left
        await controls.start({
          x: -totalWidth,
          transition: {
            duration: 30, // Adjust duration for scroll speed
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          },
        });
      }
    };

    animateFlags();
  }, [controls]);

  return (
    <div className="w-full overflow-hidden bg-blue-500 py-8">
      <motion.div
        className="flex flex-nowrap"
        ref={containerRef}
        animate={controls}
      >
        {duplicatedFlags.map((flag, index) => (
          <div
            key={index}
            className="flex-shrink-0 mx-4 flex flex-col items-center"
          >
            <Image
              src={flag.src}
              alt={flag.alt}
              width={150}
              height={100}
              className="object-contain"
              sizes="(max-width: 640px) 80px,
                     (max-width: 768px) 100px,
                     (max-width: 1024px) 120px,
                     150px"
            />
            <p className="text-center text-white text-sm mt-2">{flag.name}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Flags;
 