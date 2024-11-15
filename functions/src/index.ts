import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as json2csv from "json2csv";

admin.initializeApp();

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
      "SNsMJbdIYLhnQRYfnj3y6fiV8j63",
      "yAw5WFrBYhWK0qkXaL59u6JjgM53",
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
