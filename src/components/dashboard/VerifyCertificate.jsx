"use client";
import React, { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { motion } from "framer-motion";

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setVerificationStatus(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/gio/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ certificateCode: certificateId }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Verification Failed. Please check the certificate number."
        );
      }

      const data = await response.json();

      setIsVerified(true);
      setVerificationStatus("Certificate Verified Successfully!");
      setCertificateData(data);
      generateCertificate(data);
    } catch (error) {
      console.error("Verification Error:", error.message);
      setIsVerified(false);
      setVerificationStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateCertificate = async (data) => {
    try {
      const templateUrl = "/GLOBAL INNOVATOR OLYMPIAD CERTIFICATE.pdf";
      const existingPdfBytes = await fetch(templateUrl).then((res) =>
        res.arrayBuffer()
      );

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      const nameX = 225;
      const nameY = 590;
      const schoolNameX = 230;
      const schoolNameY = 565;
      const globalRankX = 335;
      const globalRankY = 455;
      const countryRankX = 338;
      const countryRankY = 428;
      const stateRankX = 340;
      const stateRankY = 403;
      const certificateIdX = 310;
      const certificateIdY = 295;
      const dateX = 430;
      const dateY = 183;

      const name = data.name || "N/A";
      firstPage.drawText(name.toUpperCase(), {
        x: nameX,
        y: nameY,
        size: 18,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      const schoolName = data.schoolname || "N/A";
      firstPage.drawText(schoolName.toUpperCase(), {
        x: schoolNameX,
        y: schoolNameY,
        size: 16,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      const globalRank = data.rankings.global.rank || "N/A";
      firstPage.drawText(`#${globalRank}`, {
        x: globalRankX,
        y: globalRankY,
        size: 14,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      const countryRank = data.rankings.country.rank || "N/A";
      firstPage.drawText(`#${countryRank}`, {
        x: countryRankX,
        y: countryRankY,
        size: 14,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      const stateRank = data.rankings.state.rank || "N/A";
      firstPage.drawText(`#${stateRank}`, {
        x: stateRankX,
        y: stateRankY,
        size: 14,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText((data.certificateCode || "N/A").toUpperCase(), {
        x: certificateIdX,
        y: certificateIdY,
        size: 14,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      const formattedDate = `Date: ${new Date(
        data.timestamp
      ).toLocaleDateString()}`;
      firstPage.drawText(formattedDate, {
        x: dateX,
        y: dateY,
        size: 12,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error generating certificate:", error);
    }
  };

  return (
    <section className="verify-section w-full flex flex-col items-center justify-center bg-[#f4f6f9] py-8 px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl flex flex-col items-center p-4 sm:p-6 md:p-8 lg:p-12 shadow-lg">
        <div className="text-center mb-6">
          <motion.h1
            className="text-xl sm:text-2xl md:text-3xl font-bold text-[#106EB5]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Certificate Verification
          </motion.h1>
          <motion.p
            className="text-sm md:text-lg mt-4 text-gray-700"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          >
            Enter the Credential ID to verify its authenticity.
          </motion.p>
        </div>

        <motion.form
          className="w-full max-w-md space-y-4"
          onSubmit={handleVerification}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        >
          <div>
            <label
              htmlFor="certificateId"
              className="block text-sm font-medium text-black"
            >
              Credential ID
            </label>
            <input
              type="text"
              id="certificateId"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md mt-2 text-sm md:text-base"
              placeholder="Enter the Credential ID"
            />
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 text-white bg-[#106EB5] rounded-md mt-4 text-sm md:text-base hover:bg-blue-600"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
          >
            {loading ? "Verifying..." : "Verify Certificate"}
          </motion.button>
        </motion.form>

        {verificationStatus && (
          <motion.div
            className={`mt-4 text-center text-sm md:text-lg font-semibold ${
              isVerified ? "text-green-500" : "text-red-500"
            }`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
          >
            {verificationStatus}
          </motion.div>
        )}

        {pdfUrl && (
          <div className="mt-6 w-full text-center">
            <iframe
              src={pdfUrl}
              width="100%"
              height="600px"
              className="rounded-md shadow-lg"
              title="Certificate Preview"
            ></iframe>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <a
                href={`https://wa.me/?text=Check out my certificate: ${pdfUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 text-sm sm:text-base"
              >
                Share on WhatsApp
              </a>
              <a
                href={pdfUrl}
                download="Certificate.pdf"
                className="bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 text-sm sm:text-base"
              >
                Download & Share on Instagram
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VerifyCertificate;
