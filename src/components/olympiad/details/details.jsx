import { FaAward, FaExclamationTriangle, FaClock, FaLaptop } from 'react-icons/fa'; // Importing icons

const cardData = [
  {
    title: 'Marks',
    description: 'Each question is worth 4 marks.',
    icon: <FaAward />, // Updated icon
  },
  {
    title: 'Negative Marking',
    description: '1 mark will be deducted for every incorrect answer.',
    icon: <FaExclamationTriangle />, // Updated icon
  },
  {
    title: 'Time Limit',
    description: 'You have 45 seconds to answer each question.',
    icon: <FaClock />, // Updated icon
  },
  {
    title: 'Mode',
    description: 'The Olympiad is completely online, hosted on a secure AI-driven platform.',
    icon: <FaLaptop />, // Updated icon
  },
];

const Details = () => {
  return (
    <div className="p-8">
      {/* Title */}
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Olympiad <span className="text-blue-500">Details</span>
      </h2>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-6 h-64 w-full rounded-xl bg-gradient-to-br from-blue-500 to-green-500 hover:from-green-500 hover:to-blue-500 text-white transition transform hover:-translate-y-3 hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            {/* Icon */}
            <div className="text-6xl mb-4 animate-bounce">{card.icon}</div>

            {/* Text Content */}
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-3">{card.title}</h3>
              <p className="text-sm lg:text-base">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Details;
