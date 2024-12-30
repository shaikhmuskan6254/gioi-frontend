"use client";

import Footer from "@/components/layouts/footer/footer";
import Navbar from "@/components/layouts/navbar/navbar";
import Terms from "@/components/policies/terms/Terms";
import Head from "next/head";

const Page = () => {
  return (
    <>
      <head>
        {/* Title */}
        <title>Terms and Conditions - Global Innovator Olympiad (GIO)</title>
        {/* Meta Description */}
        <meta
          name="description"
          content="Read the Terms and Conditions of Global Innovator Olympiad (GIO). Understand the guidelines, user rights, and responsibilities for participating in our events."
        />
        {/* Keywords */}
        <meta
          name="keywords"
          content="Terms and Conditions, GIO Terms, user agreement, Global Innovator Olympiad terms, GIO policies"
        />
        {/* Canonical Tag */}
        <link
          rel="canonical"
          href="https://gio.international/terms-conditions"
        />
        {/* Open Graph Meta Tags */}
        <meta
          property="og:title"
          content="Terms and Conditions - Global Innovator Olympiad"
        />
        <meta
          property="og:description"
          content="Learn about the Terms and Conditions of Global Innovator Olympiad (GIO) to understand your rights and obligations as a participant."
        />
        <meta property="og:image" content="/GIOLOGO.png" />{" "}
        {/* Replace with actual path */}
        <meta
          property="og:url"
          content="https://gio.international/terms-conditions"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
            {/* Viewport (Needed for all pages) */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <div>
        <Navbar />
        <Terms />
        <Footer />
      </div>
    </>
  );
};

export default Page;
