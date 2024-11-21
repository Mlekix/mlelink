import React, { useState, useEffect } from "react";
import { db, auth, collectionUsersName } from "../config/firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";

import LinkBtn from "../components/LinkBtn";

const presetImages = [
  "https://avatar.iran.liara.run/public/boy",
  "https://avatar.iran.liara.run/public/girl",
];

const SettingsPage: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>("default");
  const [bio, setBio] = useState<string>("");
  const [cardName, setCardName] = useState<string>("");
  const [links, setLinks] = useState<{ name: string; url: string }[]>([]);
  const [profilePicUrl, setProfilePicUrl] = useState<string>(presetImages[0]);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!auth.currentUser) return;

      try {
        const userDocRef = doc(db, collectionUsersName, auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setBio(userData.bio || "");
          setCardName(userData.cardName || auth.currentUser.displayName);
          setSelectedPreset(userData.stylePreset || "default");
          setLinks(userData.links || [{ name: "", url: "" }]);
          setProfilePicUrl(userData.profilePicUrl || presetImages[0]);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser) {
      alert("User is not logged in");
      return;
    }

    try {
      const userDocRef = doc(db, collectionUsersName, auth.currentUser.uid);

      await setDoc(
        userDocRef,
        {
          bio,
          cardName,
          stylePreset: selectedPreset,
          links,
          profilePicUrl,
        },
        { merge: true }
      );

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings.");
    }
  };

  return (
    <div>
      <h1>Settings</h1>

      {/* Back to main page */}
      <LinkBtn destination="/user" destinationName="Back to main page" />
      <br />

      {/* Name Input */}
      <h3>Name of your MleLink Card</h3>
      <input
        className="p-1.5 pr-10 mr-3 border border-blue-500 rounded-md"
        id="name"
        name="name"
        type="text"
        placeholder="Name of MleLink Card"
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
      />

      {/* Bio Input */}
      <h3 className="mt-5">What describes your MleLink?</h3>
      <input
        className="p-1.5 pr-10 mr-3 border border-blue-500 rounded-md"
        id="bio"
        name="bio"
        type="text"
        placeholder="Bio of MleLink cArd"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      {/* Profile Picture Selection */}
      <h3 className="mt-5">Choose a Profile Picture</h3>
      <div className="flex space-x-4">
        {presetImages.map((imgUrl, index) => (
          <img
            key={index}
            src={imgUrl}
            alt={`Preset ${index}`}
            onClick={() => setProfilePicUrl(imgUrl)}
            className={`w-16 h-16 rounded-full cursor-pointer border ${
              profilePicUrl === imgUrl
                ? "border-blue-500"
                : "border-gray-300, scale-75"
            }`}
          />
        ))}
      </div>

      {/* Style Preset Selection */}
      <div className="my-5">
        <h3>Choose a style for your MleLink</h3>
        <select
          id="stylePreset"
          value={selectedPreset}
          onChange={(e) => setSelectedPreset(e.target.value)}
          className="mt-1 block pl-3 pr-10 py-2 text-base border border-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="default">Default</option>
          <option value="dark">Dark Mode</option>
          <option value="light">Light Mode</option>
        </select>
      </div>

      {/* Links */}
      <h3>Set Links for your page!</h3>
      {links.map((link, index) => (
        <div key={index} className="mt-2 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Link Name"
            value={link.name}
            onChange={(e) =>
              setLinks((prev) => {
                const updated = [...prev];
                updated[index].name = e.target.value;
                return updated;
              })
            }
            className="p-1 border border-blue-500 rounded-md"
          />
          <input
            type="text"
            placeholder="Link URL"
            value={link.url}
            onChange={(e) =>
              setLinks((prev) => {
                const updated = [...prev];
                updated[index].url = e.target.value;
                return updated;
              })
            }
            className="p-1 border border-blue-500 rounded-md"
          />
        </div>
      ))}
      <button
        onClick={() => setLinks([...links, { name: "New Link", url: "" }])}
        className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Add New Link
      </button>
      <br />
      {/* Save */}
      <button
        onClick={handleSave}
        className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Save
      </button>
    </div>
  );
};

export default SettingsPage;
