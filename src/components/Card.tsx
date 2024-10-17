const Card: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-80">
        {/* Profile Picture */}
        <div className="flex justify-center mb-4">
          <img
            src=""
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-gray-300"
          />
        </div>

        {/* Name/Title */}
        <h2 className="text-center text-xl font-semibold mb-2">John Doe</h2>
        <p className="text-center text-gray-500 mb-6">Web Developer</p>

        {/* Link Buttons */}
        <div className="space-y-4">
          <button className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
            About Me
          </button>
          <button className="block w-full text-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
            Projects
          </button>
          <button className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};
export default Card;
