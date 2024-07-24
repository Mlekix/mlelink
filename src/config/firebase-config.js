import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAYdA5n_zwJ9tskTC6kiDbwWCWZXTmoOEQ",
  authDomain: "mlelink.firebaseapp.com",
  projectId: "mlelink",
  storageBucket: "mlelink.appspot.com",
  messagingSenderId: "747694506677",
  appId: "1:747694506677:web:20efff9dedb00b5b77f4fc",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

setPersistence(auth, browserSessionPersistence);
