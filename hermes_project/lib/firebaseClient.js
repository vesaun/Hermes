// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjlA_2Grs9rhqKgiQifxIjd68RM3zJuaI",
  authDomain: "hackcu-452419.firebaseapp.com",
  projectId: "hackcu-452419",
  storageBucket: "hackcu-452419.firebasestorage.app",
  messagingSenderId: "206138490840",
  appId: "1:206138490840:web:7ec631c502abf47cd27cad",
  measurementId: "G-BZWMTLWPVX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);