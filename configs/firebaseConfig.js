// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "iAIzaSyC5UVNIdxqyBHeVYWNHOVFF43Hu1LegEDM",
  authDomain: "the-wild-oasis-426315.firebaseapp.com",
  projectId: "the-wild-oasis-426315",
  storageBucket: "the-wild-oasis-426315.appspot.com",
  messagingSenderId: "884217541973",
  appId: "1:884217541973:web:907a80a0a6ed4057fbabdc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
