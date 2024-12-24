import React, { useState, useEffect } from "react";
import { db, auth, collectionUsersName } from "../config/firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Popup from "../components/Popup";
import validationSchema from "../config/validationSchema";
import { useFormik } from "formik";

const presetImages = [
  "https://avatar.iran.liara.run/public/boy",
  "https://avatar.iran.liara.run/public/girl",
];

const SettingsPage: React.FC = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(true);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [navigationTarget, setNavigationTarget] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      cardName: "",
      bio: "",
      links: [{ name: "", url: "" }],
      profilePicUrl: presetImages[0],
      stylePreset: "default",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!auth.currentUser) {
        alert("User is not logged in");
        return;
      }
      try {
        const userDocRef = doc(db, collectionUsersName, auth.currentUser.uid);

        await setDoc(
          userDocRef,
          {
            bio: values.bio,
            cardName: values.cardName,
            stylePreset: values.stylePreset,
            links: values.links,
            profilePicUrl: values.profilePicUrl,
          },
          { merge: true }
        );

        alert("Settings saved successfully!");
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Error saving settings:", error);
        alert("Failed to save settings.");
      }
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      if (!auth.currentUser) return;

      try {
        const userDocRef = doc(db, collectionUsersName, auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          formik.setValues({
            cardName: userData.cardName || auth.currentUser.displayName || "",
            bio: userData.bio || "",
            stylePreset: userData.stylePreset || "default",
            links: userData.links || [{ name: "", url: "" }],
            profilePicUrl: userData.profilePicUrl || presetImages[0],
          });
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };

    fetchSettings();
  }, []);

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
    <div className="flex flex-col items-center">
      <h1>Settings</h1>

      {/* Back to main page button */}
      <button
        onClick={() => handleNavigation("/user")}
        className="m-5 ml-0 p-1 px-2 border bg-yellow-300 border-yellow-400 text-black rounded-md hover:border-yellow-600 hover:bg-yellow-500 hover:text-white transition-all duration-300"
      >
        Back to main page
      </button>
      <br />

      <form onSubmit={formik.handleSubmit}>
        {/* Name Input */}
        <h3>Name of your MleLink Card</h3>
        <input
          className="p-1.5 pr-10 mr-3 border border-blue-500 rounded-md"
          id="cardName"
          name="cardName"
          type="text"
          placeholder="Name of MleLink Card"
          value={formik.values.cardName}
          onChange={formik.handleChange}
        />
        {formik.touched.cardName && formik.errors.cardName && (
          <div className="text-red-500">{formik.errors.cardName}</div>
        )}

        {/* Bio Input */}
        <h3 className="mt-5">What describes your MleLink? (Optional)</h3>
        <input
          className="p-1.5 pr-10 space-x-10 border border-blue-500 rounded-md"
          id="bio"
          name="bio"
          type="text"
          placeholder="Bio of MleLink cArd"
          value={formik.values.bio}
          onChange={formik.handleChange}
        />
        {formik.touched.bio && formik.errors.bio && (
          <div className="text-red-500">{formik.errors.bio}</div>
        )}

        {/* Profile Picture Selection */}
        <h3 className="mt-5">Choose a Profile Picture</h3>
        <div className="flex space-x-4">
          {presetImages.map((imgUrl, index) => (
            <img
              key={index}
              src={imgUrl}
              alt={`Preset ${index}`}
              onClick={() => formik.setFieldValue("profilePicUrl", imgUrl)}
              className={`w-16 h-16 rounded-full cursor-pointer border ${
                formik.values.profilePicUrl === imgUrl
                  ? "border-blue-500"
                  : "border-gray-300 scale-75"
              }`}
            />
          ))}
        </div>

        {/* Style Preset Selection */}
        <div className="my-5">
          <h3>Choose a style for your MleLink</h3>
          <select
            id="stylePreset"
            value={formik.values.stylePreset}
            onChange={formik.handleChange}
            className="mt-1 block pl-3 pr-10 py-2 text-base border border-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="default">Default</option>
            <option value="dark">Dark Mode</option>
            <option value="light">Light Mode</option>
          </select>
        </div>

        {/* Links */}
        <h3>Set Links for your page!</h3>
        {formik.values.links.map((link, index) => (
          <div key={index} className="mt-2 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Link Name"
              name={`links[${index}].name`}
              value={formik.values.links[index].name}
              onChange={formik.handleChange}
              className="p-1 border border-blue-500 rounded-md"
            />
            <input
              type="text"
              placeholder="Link URL"
              name={`links[${index}].url`}
              value={formik.values.links[index].url}
              onChange={formik.handleChange}
              className="p-1 border border-blue-500 rounded-md"
            />

            <button
              type="button"
              onClick={() => {
                const updatedLinks = formik.values.links.filter(
                  (_, i) => i !== index
                );
                formik.setFieldValue("links", updatedLinks);
              }}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}

        {formik.touched.links &&
          formik.errors.links &&
          Array.isArray(formik.errors.links) &&
          formik.errors.links.map((error, index) => (
            <div key={index} className="text-red-500">
              {typeof error === "string" ? (
                <div>{error}</div>
              ) : (
                <>
                  {error?.name && (
                    <div>
                      Link {index + 1} Name Error: {error.name}
                    </div>
                  )}
                  {error?.url && (
                    <div>
                      Link {index + 1} URL Error: {error.url}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

        <button
          type="button"
          onClick={() =>
            formik.setFieldValue("links", [
              ...formik.values.links,
              { name: "", url: "https://" },
            ])
          }
          className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Link
        </button>
        <br />

        {/* Save Button */}
        <button
          type="submit"
          className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </form>

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
