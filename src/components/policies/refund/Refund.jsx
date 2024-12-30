const Refund = () => {
    return (
      <>
        {/* Header Section */}
        <div className="relative w-full h-64 bg-blue-500">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-2">REFUND POLICY</h1>
            <p className="text-lg md:text-xl mt-2 font-medium">
              Learn about our refund policy for GIO events and activities.
            </p>
            <p className="text-sm mt-4">
              <a href="/" className="text-white hover:underline">Home</a> / <span className="text-green-400">Refund Policy</span>
            </p>
          </div>
        </div>
  
        {/* Content Section */}
        <div className="px-6 sm:px-12 lg:px-20 py-10 md:py-16 bg-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Refund Policy</h2>
          <p className="mb-6 text-lg md:text-xl text-gray-700 leading-relaxed">
            At GIO, we maintain a strict no-refund policy once the registration is completed. This policy applies to all our events and activities. We believe in providing clear and comprehensive information about our offerings so that participants can make informed decisions before committing to registration.
          </p>
          <p className="mb-6 text-lg md:text-xl text-gray-700 leading-relaxed">
            If you encounter any issues or have a pending payment, please do not hesitate to contact us at 
            <a href="mailto:globalinnovatorolympiad@gmail.com" className="text-blue-500 hover:underline ml-1">globalinnovatorolympiad@gmail.com</a>. 
            Our team is here to assist you with any payment-related concerns and ensure a smooth experience.
          </p>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            Thank you for your understanding and support. We appreciate your participation in the Global Innovator Olympiad and look forward to a rewarding and enriching event for all involved.
          </p>
        </div>
      </>
    );
  };
  
  export default Refund;
  