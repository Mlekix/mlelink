import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { auth } from "../config/firebase-config";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";

import LogOut from "../components/LogOut";
import Card from "../components/Card";
import LinkBtn from "../components/LinkBtn";

const UserPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [firstTime, setFirstTime] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        checkIfFirstTime(currentUser.uid);
      } else {
        navigate("/signin");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const checkIfFirstTime = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.firstLogin) {
          setFirstTime(true);

          await updateDoc(userDocRef, { firstLogin: false });
        }
      }
    } catch (err) {
      console.error("Error checking first-time login:", err);
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <LogOut />
      {user ? (
        <div>
          <h1>Welcome, {user.displayName}</h1>
          <LinkBtn destination="/settings" destinationName="Settings"></LinkBtn>

          {firstTime ? <SettingsComponent /> : <UserProfile />}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

const SettingsComponent: React.FC = () => (
  <div>
    <h2>
      So i see You are first time here so lets go to settings then, to set up
      your new MleLink!
    </h2>
  </div>
);

const UserProfile: React.FC = () => (
  <div>
    <Card />
  </div>
);

export default UserPage;
