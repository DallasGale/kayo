interface ImportMetaEnv {
  readonly NEXT_PUBLIC_FIREBASE_API_KEY: string;
  readonly NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  readonly NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
  readonly NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
  readonly NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly NEXT_PUBLIC_FIREBASE_APP_ID: string;
}
declare global {
  interface ImportMeta extends ImportMetaEnv {}
}

import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

console.log("Env Mode:", import.meta.env.MODE);
console.log("Project ID:", import.meta.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

const firebaseConfig = {
  apiKey: import.meta.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    console.log("Attempting Google Sign-In...");
    const result = await signInWithPopup(auth, provider);
    console.log("User signed in:", result.user);
  } catch (error) {
    console.error("Error during sign-in:", error);
  }
};

export const logout = () => {
  return signOut(auth);
};
const functions = getFunctions(app);

const refreshToken = async () => {
  if (auth.currentUser) {
    await auth.currentUser.getIdToken(true); // Force token refresh
    console.log("Token refreshed with new claims");
  }
};

export async function exportCollection(collectionName: string) {
  console.log({ collectionName });
  try {
    await refreshToken();

    const exportFunc = httpsCallable(functions, "exportFirestoreToCSV");
    const result = (await exportFunc({ collection: collectionName })) as {
      data: { csv: string };
    };
    console.log({ result });

    // Create and download the CSV file
    const blob = new Blob([result.data.csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${collectionName}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export failed:", error);
  }
}

export const setAdminRole = httpsCallable(functions, "setAdminRole");
