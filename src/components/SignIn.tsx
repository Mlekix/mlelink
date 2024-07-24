import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../config/firebase-config";
import { signInWithPopup } from "firebase/auth";

const SignIn = () => {
  // Route after Sign In
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/user");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center">
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
