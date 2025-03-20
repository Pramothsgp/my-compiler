// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBi2hlelj868661p7RohY_pjCD9PspoWLQ",
  authDomain: "jumble-code-app.firebaseapp.com",
  projectId: "jumble-code-app",
  storageBucket: "jumble-code-app.firebasestorage.app",
  messagingSenderId: "908897698826",
  appId: "1:908897698826:web:ae6254ca16b6b91b470bf3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
