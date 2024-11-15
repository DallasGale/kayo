import {
  collection,
  writeBatch,
  doc,
  getDocs,
  query,
  where,
  type DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./client";

// Interface for form data
interface FormData {
  id?: string;
  [key: string]: any;
}

export class FirestoreBatchOperations {
  private readonly BATCH_SIZE = 500; // Firestore batch limit is 500 operations

  /**
   * Create multiple documents in a batch
   */
  async batchCreate(collectionName: string, documents: FormData[]) {
    try {
      const batches = this.createBatches(documents);

      for (const batch of batches) {
        const writeBatch = this.createWriteBatch();

        batch.forEach((doc) => {
          const docRef = this.createDocRef(collectionName, doc.id);
          writeBatch.set(docRef, doc);
        });

        await writeBatch.commit();
      }

      return {
        success: true,
        message: `Successfully created ${documents.length} documents`,
      };
    } catch (error) {
      console.error("Batch create failed:", error);
      throw error;
    }
  }

  /**
   * Update multiple documents in a batch
   */
  async batchUpdate(collectionName: string, updates: FormData[]) {
    try {
      const batches = this.createBatches(updates);

      for (const batch of batches) {
        const writeBatch = this.createWriteBatch();

        batch.forEach((doc) => {
          const docRef = this.createDocRef(collectionName, doc.id);
          writeBatch.update(docRef, doc);
        });

        await writeBatch.commit();
      }

      return {
        success: true,
        message: `Successfully updated ${updates.length} documents`,
      };
    } catch (error) {
      console.error("Batch update failed:", error);
      throw error;
    }
  }

  /**
   * Delete multiple documents in a batch
   */
  async batchDelete(collectionName: string, documentIds: string[]) {
    try {
      const batches = this.createBatches(documentIds);

      for (const batch of batches) {
        const writeBatch = this.createWriteBatch();

        batch.forEach((id) => {
          const docRef = this.createDocRef(collectionName, id);
          writeBatch.delete(docRef);
        });

        await writeBatch.commit();
      }

      return {
        success: true,
        message: `Successfully deleted ${documentIds.length} documents`,
      };
    } catch (error) {
      console.error("Batch delete failed:", error);
      throw error;
    }
  }

  /**
   * Query and update documents in batches
   */
  async queryAndBatchUpdate(
    collectionName: string,
    whereConditions: [string, any, any][],
    updateData: Partial<FormData>,
  ) {
    try {
      const collectionRef = collection(db, collectionName);
      let q = query(collectionRef);

      // Apply where conditions
      whereConditions.forEach(([field, operator, value]) => {
        q = query(q, where(field, operator, value));
      });

      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs;
      const batches = this.createBatches(documents);

      for (const batch of batches) {
        const writeBatch = this.createWriteBatch();

        batch.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          writeBatch.update(doc.ref, updateData);
        });

        await writeBatch.commit();
      }

      return {
        success: true,
        message: `Successfully updated ${documents.length} documents`,
      };
    } catch (error) {
      console.error("Query and batch update failed:", error);
      throw error;
    }
  }

  private createBatches<T>(items: T[]): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += this.BATCH_SIZE) {
      batches.push(items.slice(i, i + this.BATCH_SIZE));
    }
    return batches;
  }

  private createWriteBatch() {
    return writeBatch(db);
  }

  private createDocRef(collectionName: string, docId?: string) {
    return docId
      ? doc(db, collectionName, docId)
      : doc(collection(db, collectionName));
  }
}

// Export a singleton instance
export const firestoreBatch = new FirestoreBatchOperations();
