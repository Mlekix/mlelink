import SignIn from "../components/SignIn";
import { Link } from "react-router-dom";

const StartPage = () => {
  return (
    <div className="justify-center flex flex-col justify-center items-center">
      <h1 className="">MleLink</h1>
      <h2>*WIP*</h2>
      <SignIn />
      <Link to="/signup">
        <button className="px-4 py-2 mt-2 border-2 border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white transition-all duration-300 rounded">
          Sign Up!
        </button>
      </Link>
    </div>
  );
};

export default StartPage;
