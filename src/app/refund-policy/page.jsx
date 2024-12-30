"use client";

import Refund from "@/components/policies/refund/Refund";
import Footer from "@/components/layouts/footer/footer";
import Navbar from "@/components/layouts/navbar/navbar";


const Page = () => {
  return (
    <>
      <head>
        {/* Title */}
        <title>Refund Policy - Global Innovator Olympiad (GIO)</title>
        {/* Meta Description */}
        <meta
          name="description"
          content="Read the Refund Policy of Global Innovator Olympiad (GIO) to understand the terms and conditions regarding refunds and cancellations."
        />
        {/* Keywords */}
        <meta
          name="keywords"
          content="Refund Policy, GIO refunds, refund terms, cancellation policy, Global Innovator Olympiad policy"
        />
        {/* Canonical Tag */}
        <link rel="canonical" href="https://gio.international/refund-policy" />
        {/* Open Graph Meta Tags */}
        <meta
          property="og:title"
          content="Refund Policy - Global Innovator Olympiad"
        />
        <meta
          property="og:description"
          content="Learn about the refund and cancellation policy for the Global Innovator Olympiad (GIO). Understand our guidelines for requesting refunds."
        />
        <meta property="og:image" content="/GIOLOGO.png" />{" "}
        {/* Replace with actual path */}
        <meta
          property="og:url"
          content="https://gio.international/refund-policy"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
            {/* Viewport (Needed for all pages) */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <div>
        <Navbar />
        <Refund />
        <Footer />
      </div>
    </>
  );
};

export default Page;
