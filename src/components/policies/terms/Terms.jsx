const Terms = () => {
    return (
      <>
        {/* Header Section */}
        <div className="relative w-full h-64 bg-blue-500">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-2">TERMS AND CONDITIONS</h1>
            <p className="text-lg md:text-xl mt-2 font-medium">
              Learn about the terms and conditions for GIO events and activities.
            </p>
            <p className="text-sm mt-4">
              <a href="/" className="text-white hover:underline">Home</a> / <span className="text-green-400">Terms and Conditions</span>
            </p>
          </div>
        </div>
  
        {/* Content Section */}
        <div className="px-6 sm:px-12 lg:px-20 py-10 md:py-16 bg-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Terms and Conditions</h2>
          <ol className="list-decimal ml-6 text-lg md:text-xl text-gray-700 leading-relaxed">
            <li className="mb-6">
              <strong>Acceptance of Terms:</strong> By participating in the Global Innovator Olympiad (GIO), you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should not participate in the GIO.
            </li>
            <li className="mb-6">
              <strong>Eligibility:</strong> Participation in the GIO is open to students, teams, and individuals who meet the eligibility criteria outlined on our website. We reserve the right to disqualify any participant who does not meet these criteria.
            </li>
            <li className="mb-6">
              <strong>Registration:</strong> Participants must complete the registration process as described on our website. All information provided must be accurate and complete. The GIO reserves the right to reject any registration that is incomplete or incorrect.
            </li>
            <li className="mb-6">
              <strong>Code of Conduct:</strong> Participants are expected to conduct themselves in a professional and respectful manner. Any behavior that disrupts the event, violates the rules, or is deemed inappropriate by the GIO will result in disqualification.
            </li>
            <li className="mb-6">
              <strong>Intellectual Property:</strong> All materials, including but not limited to content, logos, and images provided by GIO, are the property of GIO or its licensors. Participants may not use these materials without prior written consent.
            </li>
            <li className="mb-6">
              <strong>Use of Data:</strong> By participating in the GIO, you consent to the collection and use of your data for purposes related to the event, including but not limited to marketing, promotional activities, and administrative purposes.
            </li>
            <li className="mb-6">
              <strong>Prizes and Awards:</strong> Details of prizes and awards will be provided as part of the competition rules. The GIO reserves the right to modify or cancel prizes if necessary.
            </li>
            <li className="mb-6">
              <strong>Liability:</strong> GIO is not liable for any damages or losses incurred by participants as a result of their participation in the event. Participants agree to indemnify and hold GIO harmless from any claims arising from their participation.
            </li>
            <li className="mb-6">
              <strong>Changes to Terms:</strong> GIO reserves the right to modify these Terms and Conditions at any time. Participants will be notified of any changes through our website or other communication channels.
            </li>
            <li className="mb-6">
              <strong>Governing Law:</strong> These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts in India.
            </li>
            <li className="mb-6">
              <strong>Contact Information:</strong> For any questions or concerns regarding these Terms and Conditions, please contact us at:
              <div className="mt-4 text-gray-800">
                Global Innovator Olympiad <br />
                Email: <a href="mailto:globalinnovatorolympiad@gmail.com" className="text-blue-500 hover:underline">globalinnovatorolympiad@gmail.com</a> <br />
                Phone: +91 95944 02916
              </div>
            </li>
          </ol>
        </div>
      </>
    );
  };
  
  export default Terms;
  