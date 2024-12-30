"use client";

import Hero from "@/components/aboutus/hero/hero";
import Unique from "@/components/aboutus/unique/unique";
import Cursor from "@/components/cursor/Cursor";
import Flags from "@/components/home/flags/flags";
import Footer from "@/components/layouts/footer/footer";
import Navbar from "@/components/layouts/navbar/navbar";

const Page = () => {
  return (
    <>
      <head>
        {/* Title */}
        <title>About Us - Global Innovator Olympiad (GIO)</title>
        {/* Meta Description */}
        <meta
          name="description"
          content="Learn more about the Global Innovator Olympiad (GIO), a prestigious platform for innovators worldwide to showcase their skills and achieve recognition."
        />
        {/* Keywords */}
        <meta
          name="keywords"
          content="About Global Innovator Olympiad, GIO About Us, Innovation platform, worldwide innovation competition"
        />
        {/* Open Graph Meta Tags */}
        <meta
          property="og:title"
          content="About Us - Global Innovator Olympiad (GIO)"
        />
        <meta
          property="og:description"
          content="Discover the mission and vision of the Global Innovator Olympiad. Join us in fostering innovation and creativity on a global scale."
        />
        <meta property="og:image" content="/GIOLOGO.png" />
        {/* Replace with actual path */}
        <meta property="og:url" content="https://gio.international/aboutus" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        {/* Canonical Tag */}
        <link rel="canonical" href="https://gio.international/aboutus" />
        {/* Viewport (Needed for all pages) */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <div>
        <Cursor />
        <Navbar />
        <Hero />
        <Flags />
        <Unique />
        <Footer />
      </div>
    </>
  );
};

export default Page;
