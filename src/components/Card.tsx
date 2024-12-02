import React, { useEffect, useState } from "react";

import { auth, db, collectionUsersName } from "../config/firebase-config";
import { doc, getDoc } from "firebase/firestore";

interface LinkItem {
  name: string;
  url: string;
}

interface UserProfileData {
  bio: string;
  links: LinkItem[];
  profilePicUrl?: string;
  stylePreset?: string;
  cardName?: string;
}

const Card: React.FC = () => {
  const [userData, setUserData] = useState<UserProfileData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userDocRef = doc(db, collectionUsersName, auth.currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data() as UserProfileData;
            setUserData(data);
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

  const { stylePreset, profilePicUrl, bio, links, cardName } = userData;

  const getPresetClassCard = () => {
    switch (stylePreset) {
      case "dark":
        return "bg-gray-800 text-white";
      case "light":
        return "bg-white text-black";
      default:
        return "bg-grey-200 text-black";
    }
  };

  const getPresetClassInfo = () => {
    switch (stylePreset) {
      case "dark":
        return "bg-red-800 hover:bg-red-600";
      case "light":
        return "bg-blue-500 hover:bg-blue-700";
      default:
        return "bg-yellow-400 hover:bg-yellow-600";
    }
  };

  return (
    <div className={`flex items-center justify-center ${getPresetClassCard()}`}>
      <div className="shadow-lg rounded-lg p-6 w-80">
        {/* Profile Picture */}
        <div className="flex justify-center mb-4">
          <img
            src={profilePicUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-gray-300"
          />
        </div>

        {/* Name */}
        <h2 className="text-center text-xl font-semibold mb-2">
          {cardName || auth.currentUser?.displayName}
        </h2>

        {/* Bio */}
        <p className="text-center mb-6">{bio}</p>

        {/* Links */}
        <div className="space-y-4">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full text-center ${getPresetClassInfo()} text-white font-semibold py-2 px-4 rounded-lg transition duration-300`}
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
