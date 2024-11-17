import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { faker } from "@faker-js/faker";
// import { firebaseConfig } from "../firebase/client";

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

// Generate a random submission
const generateSubmission = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  mobile: "1234567098",
  videoUrl: `https://www.youtube.com/watch?v=${faker.string.alphanumeric(11)}`,
  message: faker.lorem.paragraph().substring(0, 300),
  readTerms: true,
  over18: true,
  resident: true,
  createdAt: serverTimestamp(),
  status: "pending",
});

// Function to add a batch of submissions
const addTestSubmissions = async (count: number) => {
  console.log(`Starting to add ${count} test submissions...`);
  const startTime = Date.now();
  const submissionQueue = collection(db, "submissionQueue");

  const promises = Array.from({ length: count }, async () => {
    try {
      const submission = generateSubmission();
      await addDoc(submissionQueue, submission);
      return true;
    } catch (error) {
      console.error("Error adding submission:", error);
      return false;
    }
  });

  const results = await Promise.all(promises);
  const successful = results.filter(Boolean).length;
  const failed = count - successful;
  const duration = (Date.now() - startTime) / 1000;

  console.log(`
Test Submission Results:
------------------------
Total Attempted: ${count}
Successful: ${successful}
Failed: ${failed}
Duration: ${duration} seconds
Rate: ${Math.round(successful / duration)} submissions/second
  `);
};

// Test scenarios
const burstTest = async () => {
  console.log("Running burst test...");
  await addTestSubmissions(10);
};

const gradualTest = async () => {
  console.log("Running gradual submission test...");
  await simulateRealTimeSubmissions(
    50, // Total submissions
    5, // 5 submissions per batch
    1000 * 30, // 30 seconds between batches
  );
};

const loadTest = async () => {
  console.log("Running load test...");
  await simulateRealTimeSubmissions(
    5000, // Total submissions
    100, // 100 submissions per batch
    1000 * 30, // 30 seconds between batches
  );
};

// Function to simulate submissions over time
const simulateRealTimeSubmissions = async (
  totalSubmissions: number,
  submissionsPerBatch: number,
  delayBetweenBatchesMs: number,
) => {
  console.log(`Starting real-time simulation:`);
  console.log(`Total submissions: ${totalSubmissions}`);
  console.log(`Batch size: ${submissionsPerBatch}`);
  console.log(`Delay between batches: ${delayBetweenBatchesMs}ms`);

  const batches = Math.ceil(totalSubmissions / submissionsPerBatch);
  let completedSubmissions = 0;

  for (let i = 0; i < batches; i++) {
    const remaining = totalSubmissions - completedSubmissions;
    const batchSize = Math.min(submissionsPerBatch, remaining);

    console.log(
      `\nProcessing batch ${i + 1}/${batches} (${batchSize} submissions)`,
    );
    await addTestSubmissions(batchSize);
    completedSubmissions += batchSize;

    if (i < batches - 1) {
      console.log(`Waiting ${delayBetweenBatchesMs}ms before next batch...`);
      await new Promise((resolve) =>
        setTimeout(resolve, delayBetweenBatchesMs),
      );
    }
  }

  console.log("\nSimulation completed!");
};

export {
  burstTest,
  gradualTest,
  loadTest,
  addTestSubmissions,
  simulateRealTimeSubmissions,
};
