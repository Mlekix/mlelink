import React, { useState, useEffect } from "react";

import { db, auth } from "../config/firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";

import LinkBtn from "../components/LinkBtn";

const SettingsPage: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>("default");
  const [bio, setBio] = useState<string>("");
  const [links, setLinks] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!auth.currentUser) return;

      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setBio(userData.bio || "");
          setSelectedPreset(userData.stylePreset || "default");
          setLinks(userData.links || [{ name: "", url: "" }]);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };

    fetchSettings();
  }, []);

  const ensureHttps = (url: string) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  };

  const handleLinkChange = (
    index: number,
    field: "name" | "url",
    value: string
  ) => {
    const updatedLinks = [...links];
    updatedLinks[index][field] = field === "url" ? ensureHttps(value) : value;
    setLinks(updatedLinks);
  };

  const addLink = () => {
    setLinks([...links, { name: "New Link", url: "https://" }]); // New link starts with "https://"
  };

  const handleSave = async () => {
    if (!auth.currentUser) {
      alert("User is not logged in");
      return;
    }

    try {
      const sanitizedLinks = links.map((link) => ({
        ...link,
        url: ensureHttps(link.url),
      }));

      const userDocRef = doc(db, "users", auth.currentUser.uid);

      await setDoc(
        userDocRef,
        {
          bio,
          stylePreset: selectedPreset,
          links: sanitizedLinks,
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

      {/* Home button */}
      <LinkBtn destination="/user" destinationName="Back to main page" />

      {/* Bio input */}
      <input
        className="p-1.5 mr-3 border border-blue-500 rounded-md"
        id="bio"
        name="bio"
        type="text"
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      {/* Style preset selection WIP */}
      <div className="mt-4 border border-grey-500">
        <label
          htmlFor="stylePreset"
          className="block text-sm font-medium text-gray-700"
        >
          Choose a style of your MleLink
        </label>
        <select
          id="stylePreset"
          value={selectedPreset}
          onChange={(e) => setSelectedPreset(e.target.value)}
          className="m-1 block pl-3 pr-10 py-2 text-base border border-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="default">Default</option>
          <option value="dark">Dark Mode</option>
          <option value="light">Light Mode</option>
        </select>
      </div>

      {/* Links inputs */}
      {links.map((link, index) => (
        <div key={index} className="mt-4 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Link Name"
            value={link.name}
            onChange={(e) => handleLinkChange(index, "name", e.target.value)}
            className="p-1 border border-blue-500 rounded-md"
          />
          <input
            type="text"
            placeholder="Link URL"
            value={link.url}
            onChange={(e) => handleLinkChange(index, "url", e.target.value)}
            className="p-1 border border-blue-500 rounded-md"
          />
        </div>
      ))}

      {/* Add link button */}
      <button
        onClick={addLink}
        className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Add New Link
      </button>

      {/* Save & send button */}
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Save
      </button>
    </div>
  );
};

export default SettingsPage;
