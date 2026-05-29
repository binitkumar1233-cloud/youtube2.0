// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTvKHk2fTmSkPqLdj8i541W19yw8nUXok",
  authDomain: "yourtube-76658.firebaseapp.com",
  projectId: "yourtube-76658",
  storageBucket: "yourtube-76658.firebasestorage.app",
  messagingSenderId: "966099262557",
  appId: "1:966099262557:web:530e4569d5d89339e741b4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
