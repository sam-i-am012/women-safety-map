import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot } from "firebase/firestore";

// firebase config
const firebaseConfig = {
  apiKey: "YOUR-API-KEY",
  authDomain: "YOUR_FIREBASE_PROJECT.firebaseapp.com",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, onSnapshot };
