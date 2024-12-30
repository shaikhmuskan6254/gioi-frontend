"use client";
import React, { useEffect, useState } from "react";
import { FaUserPlus, FaGlobe } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const NotificationToast = ({ message, icon }) => (
  <motion.div
    className="flex items-center gap-3 p-4 rounded-lg shadow-md bg-white text-[#2563EB] border border-[#2563EB] relative hover:bg-[#2563EB] hover:text-white hover:shadow-lg transition duration-300"
    initial={{ opacity: 0, x: -50 }} // Start from the left
    animate={{ opacity: 1, x: 0 }} // Move to the center
    exit={{ opacity: 0, x: 50 }} // Exit to the right
    transition={{ duration: 0.8, ease: "linear" }} // Smooth linear entry and exit
  >
    <div className="text-xl">{icon}</div>
    <div>
      <h4 className="text-sm font-semibold">Update</h4>
      <p className="text-xs">{message}</p>
    </div>
  </motion.div>
);

const Notifications = () => {
  const [currentNotification, setCurrentNotification] = useState(null);

  useEffect(() => {
    const getRandomValue = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const displayNotification = async () => {
      const randomValue = getRandomValue(10, 200);
      const randomValue2 = getRandomValue(1,7) // Random for students or countries
      const isStudentNotification = Math.random() < 0.5;

      const notification = isStudentNotification
        ? {
            message: `${randomValue} students registered recently.`,
            icon: <FaUserPlus />,
          }
        : {
            message: `Participants from ${randomValue2} countries joined.`,
            icon: <FaGlobe />,
          };

      setCurrentNotification(notification);

      // Wait for fade-out before showing the next notification
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setCurrentNotification(null);

      // Wait a bit before the next notification
      await new Promise((resolve) => setTimeout(resolve, 2000));
    };

    const interval = setInterval(() => {
      displayNotification();
    }, 8000);

    // Start immediately
    displayNotification();

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="fixed bottom-4 left-4 w-80">
      <AnimatePresence>
        {currentNotification && (
          <NotificationToast
            message={currentNotification.message}
            icon={currentNotification.icon}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;
