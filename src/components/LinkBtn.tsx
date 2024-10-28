import { Link } from "react-router-dom";

interface LinkBtnProps {
  destination: string;
  destinationName: string;
}

const LinkBtn: React.FC<LinkBtnProps> = ({ destination, destinationName }) => {
  return (
    <Link to={destination}>
      <button className="m-5 p-1 px-2 border bg-yellow-300 border-yellow-400 text-black rounded-md hover:border-yellow-600 hover:bg-yellow-500 hover:text-white transition-all duration-300">
        {destinationName}
      </button>
    </Link>
  );
};

export default LinkBtn;
