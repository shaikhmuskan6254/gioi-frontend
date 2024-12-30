"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";

const Cursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursorElement = cursorRef.current;

    // Center the cursor on initial render
    gsap.set(cursorElement, {
      x: window.innerWidth / 2 - 8,
      y: window.innerHeight / 2 - 8,
    });

    const moveCursor = (e) => {
      gsap.to(cursorElement, {
        x: e.clientX - 8,
        y: e.clientY - 8,
        ease: "power2.out", // Smooth easing
        duration: 0.8, // Increased duration for a delayed, smoother follow
      });
    };

    // Add mousemove event listener
    window.addEventListener("mousemove", moveCursor);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="cursor w-3 h-3 bg-[#2563eb] fixed rounded-full pointer-events-none z-[99999] mix-blend-difference hidden lg:block"
    />
  );
};

export default Cursor;
