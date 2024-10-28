import React, { useEffect, useState } from "react";

import { auth, db } from "../config/firebase-config";
import { doc, getDoc } from "firebase/firestore";

interface LinkItem {
  name: string;
  url: string;
}

interface UserProfileData {
  bio: string;
  links: LinkItem[];
}

const Card: React.FC = () => {
  const [userData, setUserData] = useState<UserProfileData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userDocRef = doc(db, "users", auth.currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data() as UserProfileData;
            setUserData(data);
          } else {
            console.error("err from firebase");
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-80">
        {/* Profile Picture WIP */}
        <div className="flex justify-center mb-4">
          <img
            src=""
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-gray-300"
          />
        </div>

        {/* Name */}
        <h2 className="text-center text-xl font-semibold mb-2">
          {auth.currentUser?.displayName}
        </h2>

        {/* Bio input */}
        <p className="text-center text-gray-500 mb-6">{userData.bio}</p>

        {/* Link inputs */}
        <div className="space-y-4">
          {userData.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
