"use client";

import Details from "@/components/olympiad/details/details";
import Hero from "@/components/olympiad/hero/hero";
import Footer from "@/components/layouts/footer/footer";
import Navbar from "@/components/layouts/navbar/navbar";
import Cards from "@/components/olympiad/standardcards/cards";
import Cursor from "@/components/cursor/Cursor";


const Page = () => {
  return (
    <>
      <head>
        {/* Title */}
        <title>
          Global Innovator Olympiad (GIO) - Event Details and Highlights
        </title>
        {/* Meta Description */}
        <meta
          name="description"
          content="Explore the details of the Global Innovator Olympiad (GIO), a platform for innovators worldwide. Find event highlights, standard cards, and more."
        />
        {/* Keywords */}
        <meta
          name="keywords"
          content="Global Innovator Olympiad, GIO event details, innovation competition, olympiad highlights, participate in GIO"
        />
        {/* Open Graph Meta Tags */}
        <meta
          property="og:title"
          content="Global Innovator Olympiad - Event Details and Highlights"
        />
        <meta
          property="og:description"
          content="Discover the details and highlights of the Global Innovator Olympiad, fostering innovation and creativity on a global stage."
        />
        <meta property="og:image" content="/GIOLOGO.png" />
        {/* Replace with actual path */}
        <meta property="og:url" content="https://gio.international/olympiad" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        {/* Canonical Tag */}
        <link rel="canonical" href="https://gio.international/olympiad" />
            {/* Viewport (Needed for all pages) */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <div>
        <Cursor />
        <Navbar />
        <Hero />
        <Details />
        <Cards />
        <Footer />
      </div>
    </>
  );
};

export default Page;
