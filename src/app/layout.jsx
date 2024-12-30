"use client";

import React from "react";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon/favicon.ico" type="image/x-icon" />
        {/* Default Title (Fallback if no title is set in pages) */}
        <title>
          Global Innovator Olympiad (GIO) - A Global Competition for Innovators
        </title>
        {/* Default Meta Description */}
        <meta
          name="description"
          content="Participate in the Global Innovator Olympiad, a prestigious competition for innovators worldwide. Showcase your skills and stand out!"
        />
        {/* Default Meta Keywords */}
        <meta
          name="keywords"
          content="Global Innovator Olympiad, GIO, JIO, innovation olympiad, global competition, international competition, student competition, innovation event, GIO competition, JIO competition, student innovation, showcase skills, education competition, innovation awards, global innovators, student awards, innovation platform, technology competition, science olympiad, coding olympiad, tech competition, future leaders, innovation challenge, innovators of tomorrow, creativity challenge, STEM competition, global STEM event, research competition, school innovation, college innovation event, global talent platform, idea showcase, problem-solving competition, creative ideas competition, project-based learning, entrepreneurial challenge, tech challenge, design competition, international olympiad, world innovation olympiad, tech awards, education platform, skill development competition, innovation fair, exhibition of ideas, startup competition, learning event, creative thinking challenge, international talent event, global technology challenge, science innovation, coding and innovation, academic olympiad, talent recognition, research projects event, innovation expo, global research challenge, innovative ideas, pitch competition, invention awards, creativity showcase, young minds competition, student achievers, academic achievement platform, innovation mentors, leadership challenge, young innovators awards, technical excellence competition, tech fest, world innovators platform, future innovation leaders, school olympiad, global stage for innovators"
        />
        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  );
}
