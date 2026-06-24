import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUHqbnox_JmpEmVBdgLXiu--GmTADvreQ",
  authDomain: "skeletonauthanddb-d6db9.firebaseapp.com",
  projectId: "skeletonauthanddb-d6db9",
  storageBucket: "skeletonauthanddb-d6db9.firebasestorage.app",
  messagingSenderId: "304584893264",
  appId: "1:304584893264:web:4221f5d16eaa0c3aa1c255"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
