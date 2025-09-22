import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC5kSJ6aEb2xG4U949_J1PmQpkiQrwkVXk",
  authDomain: "totalfit-497b7.firebaseapp.com",
  projectId: "totalfit-497b7",
  storageBucket: "totalfit-497b7.firebasestorage.app",
  messagingSenderId: "24860982815",
  appId: "1:24860982815:web:40a07b45d18a8c05f6df2a",
  // No measurementId as it is optional and requires getAnalytics
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

// Guard against SSR and missing config during build/export
if (typeof window !== "undefined" && firebaseConfig.apiKey) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
}

export { auth, db };

