// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAZeybPt8XoRcN7YkJZazyddWrLPBBMRmI",
  authDomain: "ruchibazzar.firebaseapp.com",
  projectId: "ruchibazzar",
  storageBucket: "ruchibazzar.firebasestorage.app",
  messagingSenderId: "893358907512",
  appId: "1:893358907512:web:3df5973b3f54dfb2220d8d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);