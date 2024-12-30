"use client";

import Cursor from "@/components/cursor/Cursor";
import Footer from "@/components/layouts/footer/footer";
import Navbar from "@/components/layouts/navbar/navbar";
import Privacy from "@/components/policies/privacy/Privacy";

const Page = () => {
  return (
    <>
      <head>
        {/* Title */}
        <title>Privacy Policy - Global Innovator Olympiad (GIO)</title>
        {/* Meta Description */}
        <meta
          name="description"
          content="Read the Privacy Policy of Global Innovator Olympiad (GIO) to understand how we handle your data, privacy, and security."
        />
        {/* Keywords */}
        <meta
          name="keywords"
          content="Privacy Policy, GIO privacy terms, data privacy, Global Innovator Olympiad policy, user data security"
        />
        {/* Canonical Tag */}
        <link rel="canonical" href="https://gio.international/privacy-policy" />
        {/* Open Graph Meta Tags */}
        <meta
          property="og:title"
          content="Privacy Policy - Global Innovator Olympiad"
        />
        <meta
          property="og:description"
          content="Learn about our Privacy Policy and how Global Innovator Olympiad ensures the security and confidentiality of your data."
        />
        <meta
          property="og:url"
          content="https://gio.international/privacy-policy"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/GIOLOGO.png" />
        {/* Replace with your banner */}
        {/* Viewport (Needed for all pages) */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <div>
        <Cursor />
        <Navbar />
        <Privacy />
        <Footer />
      </div>
    </>
  );
};

export default Page;
