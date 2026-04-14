import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: "AIzaSyCWOUkBrrY6wBxTlbplGGo0BNq6y36L3co",
  authDomain: "buxton-scaffolding-ltd.firebaseapp.com",
  projectId: "buxton-scaffolding-ltd",
  storageBucket: "buxton-scaffolding-ltd.firebasestorage.app",
  messagingSenderId: "731533958594",
  appId: "1:731533958594:web:e0895f1570a6767c34ca5b",
  measurementId: "G-XRBN40K9B3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
