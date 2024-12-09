import React, { useState, useEffect } from "react";
import { db, auth, collectionUsersName } from "../config/firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Popup from "../components/Popup";

const presetImages = [
  "https://avatar.iran.liara.run/public/boy",
  "https://avatar.iran.liara.run/public/girl",
];

const SettingsPage: React.FC = () => {
  const [selectedStylePreset, setSelectedStylePreset] =
    useState<string>("default");
  const [bio, setBio] = useState<string>("");
  const [cardName, setCardName] = useState<string>("");
  const [links, setLinks] = useState<{ name: string; url: string }[]>([]);
  const [profilePicUrl, setProfilePicUrl] = useState<string>(presetImages[0]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(true);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [navigationTarget, setNavigationTarget] = useState<string | null>(null);

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
          setSelectedStylePreset(userData.stylePreset || "default");
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
          stylePreset: selectedStylePreset,
          links,
          profilePicUrl,
        },
        { merge: true }
      );

      alert("Settings saved successfully!");
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings.");
    }
  };

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

  const handleDeleteLink = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
  };

  const handleNavigation = (destination: string) => {
    if (hasUnsavedChanges) {
      setNavigationTarget(destination);
      setIsPopupVisible(true);
    } else {
      window.location.href = destination;
    }
  };

  const handleConfirmNavigation = () => {
    setIsPopupVisible(false);
    if (navigationTarget) {
      window.location.href = navigationTarget;
    }
  };

  return (
    <div>
      <h1>Settings</h1>

      {/* Back to main page button */}
      <button
        onClick={() => handleNavigation("/user")}
        className="m-5 ml-0 p-1 px-2 border bg-yellow-300 border-yellow-400 text-black rounded-md hover:border-yellow-600 hover:bg-yellow-500 hover:text-white transition-all duration-300"
      >
        Back to main page
      </button>
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
          value={selectedStylePreset}
          onChange={(e) => setSelectedStylePreset(e.target.value)}
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
                handleLinkChange(index, "url", e.target.value);
                return updated;
              })
            }
            className="p-1 border border-blue-500 rounded-md"
          />
          <button
            onClick={() => handleDeleteLink(index)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          >
            Delete
          </button>
        </div>
      ))}
      <button
        onClick={() => setLinks([...links, { name: "New Link", url: "" }])}
        className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Add New Link
      </button>
      <br />

      {/* Save and send button */}
      <button
        onClick={handleSave}
        className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Save
      </button>

      {/* Popup */}
      {isPopupVisible && (
        <Popup
          message="You have unsaved changes. Do you want to continue without saving?"
          onConfirm={handleConfirmNavigation}
          onCancel={() => setIsPopupVisible(false)}
        />
      )}
    </div>
  );
};

export default SettingsPage;
