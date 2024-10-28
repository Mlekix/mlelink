import React from "react";

import { useNavigate } from "react-router-dom";

import { auth } from "../config/firebase-config";
import { signOut } from "firebase/auth";

const LogOut: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
      console.log("User signed out");
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <div>
      <button
        className="m-5 p-1 px-2 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all duration-300"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default LogOut;
