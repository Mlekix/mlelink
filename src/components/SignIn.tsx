import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../config/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase-config";

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          firstLogin: true,
          createdAt: serverTimestamp(),
        });
      }

      navigate("/user");
    } catch (err) {
      console.error("Error signing in: ", err);
    }
  };

  return (
    <div>
      <button
        onClick={signInWithGoogle}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Sign In with Google
      </button>
    </div>
  );
};

export default SignIn;
