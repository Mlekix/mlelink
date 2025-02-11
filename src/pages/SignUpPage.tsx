import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../config/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, collectionUsersName } from "../config/firebase-config";

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerWithEmail = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDocRef = doc(db, collectionUsersName, user.uid);
      await setDoc(userDocRef, {
        firstLogin: true,
        createdAt: serverTimestamp(),
      });

      navigate("/user");
    } catch (err) {
      console.error("Error registering: ", err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl">
        Sign Up with email or just type some random email / password its no
        validation part
      </h1>
      <Link to={"/mlelink"}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-3 rounded focus:outline-none focus:shadow-outline">
          Back to signIn
        </button>
      </Link>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <button
        onClick={registerWithEmail}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Register with Email
      </button>
    </div>
  );
};

export default SignUpPage;
