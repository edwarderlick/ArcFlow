/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

// Validate connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'system', 'health'));
    console.log('Firebase connected successfully');
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.error('Firebase offline or misconfigured');
    }
  }
}

testConnection();
