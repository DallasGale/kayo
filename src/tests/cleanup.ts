import "dotenv/config";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  writeBatch,
  query,
  limit,
} from "firebase/firestore";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const clearCollection = async (collectionName: string) => {
  const collectionRef = collection(db, collectionName);
  let deletedCount = 0;
  let totalCount = 0;

  try {
    // First, count total documents
    const snapshot = await getDocs(collectionRef);
    totalCount = snapshot.size;
    console.log(`Found ${totalCount} documents in ${collectionName}`);

    // Delete in batches of 500 (Firestore batch limit)
    while (true) {
      const snapshot = await getDocs(query(collectionRef, limit(500)));

      if (snapshot.empty) {
        break;
      }

      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
        deletedCount++;
      });

      await batch.commit();
      console.log(
        `Deleted ${deletedCount}/${totalCount} documents from ${collectionName}`,
      );
    }

    console.log(
      `Successfully cleared ${deletedCount} documents from ${collectionName}`,
    );
  } catch (error) {
    console.error(`Error clearing ${collectionName}:`, error);
    throw error;
  }
};

const cleanup = async () => {
  try {
    console.log("Starting cleanup...");

    // Add your collection names here
    const collections = ["submissionQueue", "submissions"];

    for (const collectionName of collections) {
      console.log(`\nClearing collection: ${collectionName}`);
      await clearCollection(collectionName);
    }

    console.log("\nCleanup completed successfully");
  } catch (error) {
    console.error("Cleanup failed:", error);
    process.exit(1);
  }
};

// Run cleanup if this is the main module
cleanup().catch((error) => {
  console.error("Fatal error during cleanup:", error);
  process.exit(1);
});

export { cleanup, clearCollection };
