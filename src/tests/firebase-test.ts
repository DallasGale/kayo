import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseConfig } from "../firebase/client";

const testConnection = async () => {
  try {
    console.log("Testing Firebase connection...");
    console.log("Config:", JSON.stringify(firebaseConfig, null, 2));

    const app = initializeApp(firebaseConfig);
    console.log("App initialized");

    const db = getFirestore(app);
    console.log("Firestore initialized");

    // Try to read a collection
    const testCollection = collection(db, "submissionQueue");
    const snapshot = await getDocs(testCollection);
    console.log(`Successfully connected. Found ${snapshot.size} documents.`);

    return true;
  } catch (error) {
    console.error("Connection test failed:");
    console.error(JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    return false;
  }
};

testConnection().then((success) => {
  if (!success) {
    process.exit(1);
  }
});
