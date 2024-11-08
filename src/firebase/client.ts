interface ImportMetaEnv {
  readonly PUBLIC_FIREBASE_API_KEY: string;
  readonly PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  readonly PUBLIC_FIREBASE_PROJECT_ID: string;
  readonly PUBLIC_FIREBASE_STORAGE_BUCKET: string;
  readonly PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly PUBLIC_FIREBASE_APP_ID: string;
}
declare global {
  interface ImportMeta extends ImportMetaEnv {}
}

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

console.log("Env Mode:", import.meta.env.MODE);
console.log("Project ID:", import.meta.env.PUBLIC_FIREBASE_PROJECT_ID);

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Optional: Add error handling
if (!import.meta.env.PUBLIC_FIREBASE_PROJECT_ID) {
  console.error(
    "Firebase configuration is missing. Make sure your environment variables are properly set."
  );
}
