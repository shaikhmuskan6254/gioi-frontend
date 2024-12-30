import Cursor from "@/components/cursor/Cursor";
import Footer from "@/components/layouts/footer/footer";
import Navbar from "@/components/layouts/navbar/navbar";
import VerifyCertificate from "@/components/verify/verifycertificate";
import React from "react";
import Head from "next/head";

const page = () => {
  return (
    <>
      <head>
        {/* Title */}
        <title>Verify Certificate - Global Innovator Olympiad (GIO)</title>
        {/* Meta Description */}
        <meta
          name="description"
          content="Verify your certificates issued by the Global Innovator Olympiad (GIO) using our easy and secure verification tool."
        />
        {/* Keywords */}
        <meta
          name="keywords"
          content="Verify Certificate, GIO certificate verification, certificate validation, Global Innovator Olympiad certificate check"
        />
        {/* Canonical Tag */}
        <link
          rel="canonical"
          href="https://gio.international/verifycertificate"
        />
        {/* Open Graph Meta Tags */}
        <meta
          property="og:title"
          content="Verify Certificate - Global Innovator Olympiad"
        />
        <meta
          property="og:description"
          content="Easily verify certificates issued by the Global Innovator Olympiad (GIO) through our secure certificate verification tool."
        />
        <meta
          property="og:image"
          content="/GIOLOGO.png"
        />{" "}
        {/* Replace with actual path */}
        <meta
          property="og:url"
          content="https://gio.international/verifycertificate"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
            {/* Viewport (Needed for all pages) */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <div className="w-screen h-screen overflow-x-hidden">
        <Cursor />
        <Navbar />
        <VerifyCertificate />
        <Footer />
      </div>
    </>
  );
};

export default page;
