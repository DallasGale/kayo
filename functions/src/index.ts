import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as json2csv from "json2csv";
import * as cors from "cors";

admin.initializeApp();

const corsHandler = cors({ origin: true }); // Enable CORS to allow any origin.

export const exportFirestoreToCSV = functions
  .region("us-central1")
  .https.onRequest((req: functions.Request, res: functions.Response) => {
    corsHandler(req, res, async () => {
      try {
        const collection = req.query.collection as string;
        if (!collection) {
          res.status(400).send("Missing collection parameter");
          return;
        }

        const snapshot = await admin.firestore().collection(collection).get();
        const documents = snapshot.docs.map((doc) => doc.data());
        const csv = json2csv.parse(documents);

        res.header("Content-Type", "text/csv");
        res.attachment(`${collection}.csv`);
        res.send(csv);
      } catch (error) {
        console.error("Error exporting Firestore data to CSV:", error);
        res.status(500).send("Error exporting Firestore data to CSV");
      }
    });
  });
