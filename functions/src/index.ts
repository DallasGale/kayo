import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as json2csv from "json2csv";

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// ------------------------------
// 1. Export Firestore data to CSV
// ------------------------------
export const exportFirestoreToCSV = functions
  .region("us-central1")
  .runWith({
    // enforceAppCheck: true, // Enable Firebase App Check
  })
  .https.onCall(async (data, context) => {
    // Check if request is from an admin
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Must be authenticated.",
      );
    }

    // You can maintain a list of admin UIDs in your Firestore or environment config
    const ADMIN_UIDS = [
      "4qMzDHluo8eFettrWKbxGjkkePg1",
      "FcUQCFyCAFd9yV61kHunChqJoGt1",
      "d2XtvppiBSNbhcc2U5acbg6iLsa2",
      "UuKMS6QgozLOm33V56SOAxXJTDr2",
      "O2H6h6aLQtOE6COm0TPuZuCijyj2",
      "Hl2wZuD4kNUjcjVenPWwmmo6i8E2",
      "J6Z3t7Xjj5NnHZGFphageAnloHs2",
    ]; // Replace with your Firebase UID
    if (!ADMIN_UIDS.includes(context.auth.uid)) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Must be an administrator.",
      );
    }

    try {
      const collection = data.collection;
      if (!collection) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Missing collection parameter",
        );
      }

      const snapshot = await admin.firestore().collection(collection).get();
      const documents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const csv = json2csv.parse(documents);
      return { csv };
    } catch (error) {
      console.error("Error exporting Firestore data to CSV:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Error exporting Firestore data to CSV",
      );
    }
  });

// ------------------------------
// 2. Assign Admin Role
// ------------------------------
export const setAdminRole = functions.https.onCall(async (data, context) => {
  // Security check: Only authenticated users can call this function
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Only authenticated users can call this function",
    );
  }

  const uid = data.uid;

  try {
    // Set the custom claim for the user
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    return { message: `Admin role assigned to user ${uid}` };
  } catch (error) {
    throw new functions.https.HttpsError(
      "internal",
      "Error assigning admin role",
      (error as any).message,
    );
  }
});

// ------------------------------
// 3. Firestore Batch Operations
// ------------------------------

const BATCH_SIZE = 500;
// Add these at the top of your file
const SubmissionStatus = {
  PENDING: "pending",
  PROCESSED: "processed",
  ERROR: "error",
} as const;

const FinalSubmissionStatus = {
  COMPLETED: "completed",
  REJECTED: "rejected", // If you need to handle rejections
} as const;

// Function to process submissions in batches
export const processSubmissionQueue = functions
  .runWith({
    timeoutSeconds: 540, // 9 minutes
    memory: "1GB",
  })
  .pubsub // Fix the schedule syntax - use cron format
  .schedule("*/1 * * * *") // This runs every minute
  .onRun(async (context) => {
    console.log(
      "processSubmissionQueue triggered at:",
      new Date().toISOString(),
    ); // Add this

    const batchId = new Date().toISOString();
    console.log(`Starting batch process ${batchId}`);

    try {
      console.log("Checking submissionQueue collection..."); // Add this

      // Get pending submissions
      const pendingSnapshot = await db
        .collection("submissionQueue")
        .where("status", "==", "pending")
        .orderBy("createdAt")
        .limit(BATCH_SIZE)
        .get();
      console.log(`Found ${pendingSnapshot.size} pending submissions`); // Add this

      if (pendingSnapshot.empty) {
        console.log("No pending submissions to process");
        return null;
      }

      const batch = db.batch();
      const submissionsRef = db.collection("submissions");
      let processedCount = 0;

      // Process each submission
      for (const doc of pendingSnapshot.docs) {
        const submissionData = doc.data();

        // Create new submission
        const newSubmissionRef = submissionsRef.doc();
        batch.set(newSubmissionRef, {
          ...submissionData,
          status: FinalSubmissionStatus.COMPLETED,
          processedAt: admin.firestore.FieldValue.serverTimestamp(),
          batchId,
        });

        // Update queue item
        batch.update(doc.ref, {
          status: SubmissionStatus.PROCESSED,
          processedAt: admin.firestore.FieldValue.serverTimestamp(),
          batchId,
          submissionId: newSubmissionRef.id,
        });

        processedCount++;
      }

      // Commit the batch
      await batch.commit();

      console.log(
        `Successfully processed batch ${batchId} with ${processedCount} submissions`,
      );

      // Return success stats
      return {
        batchId,
        processedCount,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error processing submission batch:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Error processing submissions",
      );
    }
  });

// Optional: Function to monitor batch processing
export const getQueueStatus = functions.https.onCall(async (data, context) => {
  try {
    // Get queue statistics
    const pendingSnapshot = await db
      .collection("submissionQueue")
      .where("status", "==", "pending")
      .get();
    const pendingCount = pendingSnapshot.docs.length;

    const processedSnapshot = await db
      .collection("submissionQueue")
      .where("status", "==", "processed")
      .get();
    const processedCount = processedSnapshot.docs.length;

    // Get latest batch information
    const latestBatch = await db
      .collection("submissionQueue")
      .where("status", "==", "processed")
      .orderBy("processedAt", "desc")
      .limit(1)
      .get();

    return {
      pendingCount,
      processedCount,
      lastProcessedBatch: latestBatch.empty
        ? null
        : latestBatch.docs[0].data().batchId,
      lastProcessedAt: latestBatch.empty
        ? null
        : latestBatch.docs[0].data().processedAt,
    };
  } catch (error) {
    console.error("Error getting queue status:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error fetching queue status",
    );
  }
});

// Optional: Function to retry failed submissions
export const retryFailedSubmissions = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async (context) => {
    try {
      const failedSnapshot = await db
        .collection("submissionQueue")
        .where("status", "==", "error")
        .get();

      if (failedSnapshot.empty) {
        console.log("No failed submissions to retry");
        return null;
      }

      const batch = db.batch();

      failedSnapshot.docs.forEach((doc) => {
        batch.update(doc.ref, {
          status: "pending",
          retryCount: admin.firestore.FieldValue.increment(1),
          lastRetryAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });

      await batch.commit();
      console.log(`Reset ${failedSnapshot.size} failed submissions to pending`);

      return {
        retriedCount: failedSnapshot.size,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error retrying failed submissions:", error);
      throw error;
    }
  });
