/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Transaction } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const transactionService = {
  async addTransaction(userId: string, tx: Omit<Transaction, 'id' | 'timestamp'>) {
    const path = `users/${userId}/transactions`;
    try {
      await addDoc(collection(db, path), {
        ...tx,
        userId,
        timestamp: Date.now(), // Local timestamp for UI immediate sorting
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  subscribeToTransactions(userId: string, callback: (txs: Transaction[]) => void) {
    const path = `users/${userId}/transactions`;
    const q = query(
      collection(db, path),
      orderBy('timestamp', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      callback(txs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  }
};
