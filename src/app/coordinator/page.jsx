"use client";

import CoordinatorRegisterForm from "@/components/coordinator/CoordinatorRegistration";
import Cursor from "@/components/cursor/Cursor";
import Footer from "@/components/layouts/footer/footer";
import Navbar from "@/components/layouts/navbar/navbar";
import Head from "next/head";

const Page = () => {
  return (
    <>
      <Head>
        {/* Title */}
        <title>
          Coordinator Registration - Global Innovator Olympiad (GIO)
        </title>
        {/* Meta Description */}
        <meta
          name="description"
          content="Register as a coordinator for the Global Innovator Olympiad (GIO) and help bring innovation to your school, college, or institution."
        />
        {/* Keywords */}
        <meta
          name="keywords"
          content="Coordinator Registration, GIO Coordinator, Global Innovator Olympiad Registration, innovation coordinators, register for GIO"
        />
        {/* Open Graph Meta Tags */}
        <meta
          property="og:title"
          content="Coordinator Registration - Global Innovator Olympiad"
        />
        <meta
          property="og:description"
          content="Join as a coordinator for the Global Innovator Olympiad and help inspire innovation in your institution. Register now!"
        />
        <meta property="og:image" content="/GIOLOGO.png" />
        {/* Replace with actual path */}
        <meta
          property="og:url"
          content="https://gio.international/coordinator"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        {/* Canonical Tag */}
        <link
          rel="canonical"
          href="https://gio.international/coordinator"
        />
        {/* Viewport (Needed for all pages) */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div>
        <Cursor />
        <Navbar />
        <CoordinatorRegisterForm />
        <Footer />
      </div>
    </>
  );
};

export default Page;
